import { OpenAI } from "openai";
import { NextResponse } from "next/server";
import { withAiRequestGuard } from "@/utils/aiRequestGuard";

export const maxDuration = 60;

const MAX_PROMPT_LENGTH = 2000;

export const POST = (req: Request) =>
  withAiRequestGuard(req, async (body, recordTokens) => {
    const prompt = (body as { prompt?: unknown })?.prompt;

    if (typeof prompt !== "string" || !prompt || prompt.length > MAX_PROMPT_LENGTH) {
      return NextResponse.json(
        { error: `Prompt must be a string of at most ${MAX_PROMPT_LENGTH} characters` },
        { status: 400 }
      );
    }

    try {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const result = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-4o",
        temperature: 1,
        max_tokens: 1000,
      });

      await recordTokens(result.usage?.total_tokens ?? 0);

      const message = result?.choices?.[0]?.message?.content
        ?.trim()
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/```\s*$/i, "")
        .trim();

      if (!message) throw new Error("Error fetching data from OpenAI... Try again.");

      return NextResponse.json({ response: message });
    } catch (error: any) {
      if (error?.code === "insufficient_quota") {
        console.error("OpenAI quota exceeded. Check billing or usage limits.");
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  });
