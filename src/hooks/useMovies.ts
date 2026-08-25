import useSWR from "swr";

const fetcher = async (url: string) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  return response.json();
};

export const useMovies = (userId: string | undefined) => {
  const fallbackData =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("movies") || "[]")
      : [];

  const { data, error, mutate, isValidating, isLoading } = useSWR(
    userId ? `/api/get-all-liked_movies` : null, // Only fetch if `userId` is valid
    () => fetcher(`/api/get-all-liked_movies`),
    {
      fallbackData,
      onSuccess: (data) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("movies", JSON.stringify(data));
        }
      },
      onError: (error) => {
        console.error("Error fetching data:", error);
      },
    }
  );
  return { data: userId ? data : null, error, mutate, isValidating, isLoading };
};
