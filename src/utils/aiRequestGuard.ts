import "server-only";

import { NextResponse } from "next/server";
import {
  consumeAiRequest,
  recordAiTokens,
  refundAiRequest,
} from "@/db/services/aiQuota";
import { getSessionUser } from "@/utils/getSessionUser";
import { createRateLimiter, getClientIp } from "@/utils/rateLimit";
import { AI_LIMIT_CODES, AI_MAX_BODY_BYTES } from "@/variables";

// Burst protection on top of the daily quota.
const isRateLimited = createRateLimiter(20, 10 * 60 * 1000);

type AiHandler = (
  body: unknown,
  recordTokens: (tokens: number) => Promise<void>
) => Promise<NextResponse>;

// Checks size, burst rate and the daily AI quota, then runs the handler.
// A handler response of 400 or 5xx gives the request back to the user.
export const withAiRequestGuard = async (
  req: Request,
  handler: AiHandler
): Promise<NextResponse> => {
  const ip = getClientIp(req);

  if (Number(req.headers.get("content-length")) > AI_MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Request is too large." }, { status: 413 });
  }

  const raw = await req.text();
  if (Buffer.byteLength(raw) > AI_MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Request is too large." }, { status: 413 });
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (isRateLimited(ip)) {
    return NextResponse.json(
      {
        error: "Too many requests. Please wait a few minutes.",
        code: AI_LIMIT_CODES.rateLimited,
      },
      { status: 429 }
    );
  }

  const sessionUser = await getSessionUser();
  const source = await consumeAiRequest(sessionUser, ip);

  if (!source) {
    const isGuest = !sessionUser.userId;
    return NextResponse.json(
      {
        error: isGuest
          ? "You've used your free AI request for today. Log in to get 5 free requests every day."
          : "You've used your free AI requests for today. Buy credits to keep going, or come back tomorrow.",
        code: isGuest ? AI_LIMIT_CODES.loginRequired : AI_LIMIT_CODES.noCredits,
      },
      { status: 429 }
    );
  }

  let response: NextResponse;
  try {
    response = await handler(body, (tokens) =>
      recordAiTokens(sessionUser, ip, tokens).catch((error) =>
        console.error("Failed to record AI tokens:", error?.message)
      )
    );
  } catch (error) {
    await refundAiRequest(sessionUser, ip, source);
    throw error;
  }

  if (response.status === 400 || response.status >= 500) {
    await refundAiRequest(sessionUser, ip, source);
  }
  return response;
};
