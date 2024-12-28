import { signIn } from "@/lib/firebase/service";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(req: NextRequest) {
  const request: { email: string; password: string } = await req.json();

  const JWT_SECRET =
    process.env.NEXT_PUBLIC_JWT_SECRET ||
    "f4f8a8233cb5d780aceabdab02579f510abf945b97c75c3ea5c424b305917ae02fa05803b2d281c0792b18fd72ed40cb403fe0b46f5e1294b422f16d5b0d1964";
  const JWT_EXPIRES_IN = "1h";

  const result = await signIn(request);

  if (result) {
    const passwordComparre = await bcrypt.compare(
      request.password,
      result.password
    );

    if (passwordComparre) {
      const token = jwt.sign(
        { id: result.id, email: result.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      const response = NextResponse.json(
        {
          status: true,
          message: "Berhasil login",
          data: {
            id: result.id,
            name: result.name,
            email: result.email,
          },
          token: token,
          redirect: `${BASE_URL}/admin/project`,
        },
        { status: 200 }
      );

      response.cookies.set("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Cookie hanya bekerja di HTTPS pada production
        sameSite: "strict", // Mencegah CSRF
        maxAge: 60 * 60, // 1 jam
        path: "/", // Cookie tersedia di seluruh aplikasi
      });

      return response;
    } else {
      return NextResponse.json(
        {
          status: false,
          message: "Password atau email salah",
        },
        { status: 400 }
      );
    }
  } else {
    return NextResponse.json(
      {
        status: false,
        message: "Gagal login",
      },
      { status: 401 }
    );
  }
}
