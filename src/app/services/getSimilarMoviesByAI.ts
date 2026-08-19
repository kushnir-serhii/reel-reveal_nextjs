import { OpenAI } from "openai";
import { unstable_cache } from "next/cache";
import { IMovie, MovieTitleYear } from "@/typification";
import { firstElementsFromArrays } from "@/utils/firstElementsFromArrays";
import { getManyMoviesByTitle } from "./getManyMoviesByTitle";

const SUGGESTION_COUNT = 20;

// One AI answer per movie is enough - the recommendations for a given film do
// not change, so they are cached for 30 days instead of being regenerated on
// every page view.
const CACHE_TTL_SECONDS = 60 * 60 * 24 * 30;

const buildPrompt = (
  title: string,
  year: string,
) => `You are a connoisseur of films.
The reference movie is "${title}"${year ? ` (${year})` : ""}.

Suggest exactly ${SUGGESTION_COUNT} movies that a viewer who liked this one would enjoy.

### Rules for Selection:
1. Base the similarity on tone, theme, genre and style of the reference movie, not only on its genre label.
2. Do NOT include the reference movie itself, and do not repeat the same movie twice.
3. Use the original release year of every suggested movie so it can be identified unambiguously.
4. Recommend only real, existing movies with a rating higher than 6.0 on IMDb.
5. Use the international / English title of each movie.

### Output Format:
Return strictly a JSON object of the shape:
{"movies":[{"title":"title","year":"year"}, ...]}
with exactly ${SUGGESTION_COUNT} items and no additional text or explanation.`;

// Ask the model which movies are similar. Runs on the server with the API key,
// so the prompt is never accepted from - or exposed to - the browser.
const askAIForSimilarTitles = async (
  title: string,
  year: string,
): Promise<MovieTitleYear[]> => {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const result = await openai.chat.completions.create({
    model: "gpt-4o",
    temperature: 1,
    // Guarantees parseable JSON, so no markdown fences to strip.
    response_format: { type: "json_object" },
    messages: [{ role: "user", content: buildPrompt(title, year) }],
  });

  const content = result.choices[0]?.message?.content;

  if (!content) throw new Error("OpenAI returned an empty response");

  const parsed = JSON.parse(content);

  const suggestions: MovieTitleYear[] = Array.isArray(parsed)
    ? parsed
    : (parsed.movies ?? []);

  return suggestions.filter((item) => item?.title);
};

const loadSimilarMovies = async (
  title: string,
  year: string,
  movieId: number,
): Promise<IMovie[]> => {
  const suggestions = await askAIForSimilarTitles(title, year);

  if (!suggestions.length) return [];

  // Resolve the AI titles to real TMDB records (direct call, no HTTP hop).
  const searchResults = await getManyMoviesByTitle(suggestions);

  const movies = firstElementsFromArrays(searchResults);

  // Drop the reference movie and any duplicate TMDB hits.
  const seen = new Set<number>([movieId]);

  return movies.filter((movie) => {
    if (seen.has(movie.id)) return false;
    seen.add(movie.id);
    return true;
  });
};

export const getSimilarMoviesByAI = (
  title: string,
  year: string,
  movieId: number,
): Promise<IMovie[]> =>
  unstable_cache(
    () => loadSimilarMovies(title, year, movieId),
    ["similar-movies-ai", String(movieId)],
    { revalidate: CACHE_TTL_SECONDS, tags: [`similar-movies-${movieId}`] },
  )();
