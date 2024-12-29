import { NextResponse } from "next/server";
import { userRepository } from "../../../models/User";

export async function GET() {
  try {
    console.log("GET /api/blog called. Initializing repository.");
    const users = await userRepository().find();
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: `Error fetching users. ${error}` },
      { status: 500 }
    );
  }
}
