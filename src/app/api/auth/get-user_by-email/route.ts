import { NextResponse } from "next/server";
import User from "@/db/models/user";
import { connectDB } from "@/db/db";

/**
 * POST API endpoint to check if a user exists in the database.
 * This endpoint is used to check if a user with the provided email exists in the database.
 *
 * @param {Request} request - The request object containing the email and password.
 * @return {Promise<NextResponse>} A promise that resolves to a NextResponse object.
 * The response object contains a JSON object with a message indicating whether the user exists or not.
 * The status code of the response indicates the success or failure of the operation.
 */
export async function POST(req: Request): Promise<NextResponse> {
  try {
    // Connect to the database
    await connectDB();

    // Extract the email from the request body
    const { email } = await req.json();

    // Check whether a user with the provided email exists, without loading the document
    const exists = await User.exists({ email });

    if (!exists) {
      return NextResponse.json({ exists: false }, { status: 200 });
    }

    return NextResponse.json({ exists: true });
  } catch (error) {
    // Return a JSON response with a message indicating a server error
    return NextResponse.json(
      { message: "Server error" },
      {
        status: 500,
      }
    );
  }
}
