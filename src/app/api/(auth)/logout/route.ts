import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateToken } from "@/lib/validateToken";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { status: 401, message: "User not authenticated" },
        { status: 401 }
      );
    }

    await validateToken(token);

    const response = NextResponse.redirect(`${BASE_URL}/login`, {
      status: 302,
    });

    response.cookies.set("auth_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error di DELETE handler:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error },
      { status: 500 }
    );
  }
}
