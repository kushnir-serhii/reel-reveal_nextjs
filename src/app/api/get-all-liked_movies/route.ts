import { connectDB } from "@/db/db";
import User from "@/db/models/user";
import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  try {
    // Validate userId
    const mongoose = require("mongoose");
    const objectId = mongoose.Types.ObjectId;

    if (!objectId.isValid(userId)) {
      return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
    }

    await connectDB();

    const user = await User.findById(userId)
      .then((user) => {
        if (user) {
          return user;
        } else {
          console.log("User not found");
        }
      })
      .catch((error) => {
        console.error(
          "Error finding user >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",
          error
        );
      });

    return NextResponse.json(user.movies);
  } catch (error) {
    console.log(error);
    throw new Error("Failed to get all liked movies");
  }
}
