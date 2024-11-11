// middleware.ts
import { NextResponse } from "next/server";

export function middleware(request: Request) {
  const response = NextResponse.next();

  response.headers.set("Access-Control-Allow-Origin", "http://localhost:3000");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  // Mengembalikan respons OPTIONS jika diminta oleh preflight
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: response.headers,
    });
  }

  return response;
}

export const config = {
  matcher: "/api/:path*",
};
