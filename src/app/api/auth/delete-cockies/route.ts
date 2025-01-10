import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json({
      status: true,
      message: "Logout successful",
    });

    // Menghapus cookie dengan memberi `maxAge` 0
    response.cookies.set("auth_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
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
