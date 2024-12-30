import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function validateToken(token: string) {
  // const token = req.headers.get("Authorization")?.split(" ")[1];
  const JWT_SECRET =
    process.env.NEXT_PUBLIC_JWT_SECRET ||
    "f4f8a8233cb5d780aceabdab02579f510abf945b97c75c3ea5c424b305917ae02fa05803b2d281c0792b18fd72ed40cb403fe0b46f5e1294b422f16d5b0d1964";

  if (!token) throw new Error("User not authenticated");

  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error(error);
    throw new Error("Invalid token");
  }
}

export async function authenticateRequest() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return NextResponse.json(
      { message: "User not authenticated" },
      { status: 401 }
    );
  }

  try {
    await validateToken(token); // Validasi token
    return null; // Autentikasi berhasil
  } catch (error) {
    return NextResponse.json({ status: 401, message: error }, { status: 401 });
  }
}
