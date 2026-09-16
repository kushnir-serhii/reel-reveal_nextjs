import { firstElementsFromArrays } from "@/utils";
import { fetchQuizDataFromOpenAI } from "./fetchQuizDataFromOpenAI";

export const fetchQuizMovies = async (quizData: string[]) => {
  // Errors are rethrown so the quiz can tell a used-up quota from a failure.
  const movieTitles = await fetchQuizDataFromOpenAI(quizData);

  if (!movieTitles || !movieTitles.length) {
    throw new Error("Error fetching data from OpenAI... Try again.");
  }

  // Fetch movies from TMDB API
  const movies = await fetch(`/api/movies/many-by-titles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(movieTitles),
  }).then((res) => res.json());

  if (!movies || movies.length === 0) {
    throw new Error("Error fetching movies... Try again.");
  }

  // Return first few movies from the arrays
  return firstElementsFromArrays(movies);
};
