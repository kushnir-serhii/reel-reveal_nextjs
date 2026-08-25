import { connectDB } from "@/db/db";
import User from "@/db/models/user";
import { IStoredMovie } from "@/typification";
import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/auth";

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  const { movieId } = await req.json();

  try {
    await connectDB();
    const user = await User.findById(userId);
    const filteredMovies = user.movies.filter(
      (movie: IStoredMovie) => movie.movieId !== movieId
    );

    user.movies = filteredMovies;

    await user.save();

    return NextResponse.json(user.movies, { status: 200 });
  } catch (error) {}
}
