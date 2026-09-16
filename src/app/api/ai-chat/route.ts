import { OpenAI } from "openai";
import { NextResponse } from "next/server";
import { getManyMoviesByTitle } from "@/app/services/getManyMoviesByTitle";
import { firstElementsFromArrays } from "@/utils/firstElementsFromArrays";
import { withAiRequestGuard } from "@/utils/aiRequestGuard";
import { AiChatMovie, AiChatRole, MovieTitleYear } from "@/typification";
import {
  AI_CHAT_MAX_HISTORY_LENGTH,
  AI_CHAT_MAX_MESSAGE_LENGTH,
  AI_CHAT_MAX_MESSAGES,
} from "@/variables";

export const maxDuration = 60;

const MAX_MOVIES = 6;

const SYSTEM_PROMPT = `You are the Reel-Reveal movie assistant. Users describe a movie they are trying to remember (plot, actors, scenes, era) or the kind of movie they want to watch, and you name matching films.

Rules:
- Only talk about movies. If the request is unrelated to movies, say so briefly and return no movies.
- If the user is trying to identify one specific film, put the best match first, then up to ${MAX_MOVIES - 1} other likely candidates.
- If the user wants recommendations, return up to ${MAX_MOVIES} varied films that fit.
- If the description is too vague, ask one short clarifying question and return your best guesses (or none).
- Suggest feature films only, never TV series.
- Use the original English release title and the release year so the films can be found on TMDB.
- Keep "reply" to 1-3 short sentences. Do not list the titles in "reply"; they are shown as cards.

Respond with JSON only, in this shape:
{"reply": "short answer", "movies": [{"title": "Movie title", "year": "1999"}]}`;

type IncomingMessage = { role: AiChatRole; content: string };

const parseMessages = (body: unknown): IncomingMessage[] | null => {
  const messages = (body as { messages?: unknown })?.messages;
  if (
    !Array.isArray(messages) ||
    !messages.length ||
    messages.length > AI_CHAT_MAX_MESSAGES
  ) {
    return null;
  }

  // Assistant turns carry the suggested titles, so they may run longer.
  const valid = messages.every(
    (m) =>
      (m?.role === "user" || m?.role === "assistant") &&
      typeof m?.content === "string" &&
      m.content.trim().length > 0 &&
      m.content.length <=
        (m.role === "user" ? AI_CHAT_MAX_MESSAGE_LENGTH : AI_CHAT_MAX_MESSAGE_LENGTH * 2)
  );
  const totalLength = valid
    ? messages.reduce((sum, m) => sum + m.content.length, 0)
    : Infinity;

  if (
    totalLength > AI_CHAT_MAX_HISTORY_LENGTH ||
    messages[messages.length - 1].role !== "user"
  ) {
    return null;
  }

  return messages.map(({ role, content }) => ({ role, content }));
};

const parseAiAnswer = (raw: string): { reply: string; titles: MovieTitleYear[] } => {
  const data = JSON.parse(raw);
  const titles: MovieTitleYear[] = Array.isArray(data?.movies)
    ? data.movies
        .filter((m: any) => typeof m?.title === "string" && m.title.trim())
        .slice(0, MAX_MOVIES)
        .map((m: any) => ({
          title: m.title.trim(),
          year: m.year ? String(m.year).slice(0, 4) : "",
        }))
    : [];

  return { reply: typeof data?.reply === "string" ? data.reply : "", titles };
};

const findMoviesOnTmdb = async (titles: MovieTitleYear[]): Promise<AiChatMovie[]> => {
  if (!titles.length) return [];

  const results = await getManyMoviesByTitle(titles);

  // The AI sometimes gets the year off by one; retry those without it.
  const retried = await Promise.all(
    results.map((list, i) =>
      list.length || !titles[i].year
        ? list
        : getManyMoviesByTitle([{ title: titles[i].title, year: "" }]).then(
            ([retry]) => retry
          )
    )
  );

  const seen = new Set<number>();

  return firstElementsFromArrays(retried)
    .filter(({ id }) => !seen.has(id) && seen.add(id))
    .map(({ id, title, overview, poster_path, release_date, vote_average }) => ({
      id,
      title,
      overview,
      poster_path,
      release_date: String(release_date ?? ""),
      vote_average,
    }));
};

export const POST = (req: Request) =>
  withAiRequestGuard(req, async (body, recordTokens) => {
    const messages = parseMessages(body);
    if (!messages) {
      return NextResponse.json(
        {
          error: `Messages are limited to ${AI_CHAT_MAX_MESSAGE_LENGTH} characters, and the whole chat to ${AI_CHAT_MAX_HISTORY_LENGTH}.`,
        },
        { status: 400 }
      );
    }

    try {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const result = await openai.chat.completions.create({
        model: "gpt-4o",
        temperature: 0.7,
        max_tokens: 600,
        response_format: { type: "json_object" },
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      });

      const tokens = result.usage?.total_tokens ?? 0;
      await recordTokens(tokens);

      const content = result?.choices?.[0]?.message?.content;
      if (!content) throw new Error("Empty response from OpenAI");

      const { reply, titles } = parseAiAnswer(content);
      const movies = await findMoviesOnTmdb(titles);

      return NextResponse.json({
        reply:
          reply ||
          (movies.length
            ? "Here is what I found:"
            : "I couldn't find a match. Try adding more details."),
        movies,
        tokens,
      });
    } catch (error: any) {
      if (error?.code === "insufficient_quota") {
        console.error("OpenAI quota exceeded. Check billing or usage limits.");
      }
      console.error("AI chat error:", error?.message);

      return NextResponse.json(
        { error: "The assistant is unavailable right now. Please try again." },
        { status: 500 }
      );
    }
  });
