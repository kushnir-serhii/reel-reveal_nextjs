export const removeMovieFromDB = async (userId: string, movieId: number) => {
  try {
    const res = await fetch("/api/remove-movie", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ movieId }),
    });
    if (!res.ok) {
      throw new Error("Failed to remove movie");
    }
    const result = await res.json();

    return result;
  } catch (error) {
    console.log("Error in action removeMovie", error);
  }
};
