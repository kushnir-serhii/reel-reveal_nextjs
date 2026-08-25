import { OpenAI } from "openai";
import { NextResponse } from "next/server";

export const maxDuration = 60;

const MAX_PROMPT_LENGTH = 2000;
const RATE_LIMIT_MAX_REQUESTS = 10;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

// Per-instance only: resets on cold start and does not hold across
// concurrent Vercel lambdas. This is a speed bump, not a guarantee.
const requestTimestamps = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const timestamps = (requestTimestamps.get(key) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );

  if (timestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    requestTimestamps.set(key, timestamps);
    return true;
  }

  timestamps.push(now);
  requestTimestamps.set(key, timestamps);
  return false;
}

export const POST = async (req: Request) => {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const { prompt } = await req.json();
// console.log("=========>>>>>>>>>>>>>>>>>>",prompt)
  if (!prompt) {

    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  if (typeof prompt !== "string" || prompt.length > MAX_PROMPT_LENGTH) {
    return NextResponse.json(
      { error: `Prompt must be a string of at most ${MAX_PROMPT_LENGTH} characters` },
      { status: 400 }
    );
  }

  try {
    const result = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o",
      temperature: 1,
      max_tokens: 1000,
    });
    
    const message = result?.choices?.[0]?.message?.content
    ?.trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
    
    // console.log("RESPONSE=====>>>>>>>>>>>>>>>", result);
    if (message) {

      return NextResponse.json({ response: message });
    } else {

     throw new Error("Error fetching data from OpenAI... Try again.");
    }
  } catch (error: any) {
    if (error?.code === "insufficient_quota") {
      console.error("OpenAI quota exceeded. Check billing or usage limits.");
    }
// console.log("ERROR_<>>>>>>>>>>>>>>>>>>>>", error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

POST.displayName = "OpenAI Chat API POST Handler";