// src/middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Menambahkan Header CORS
  response.headers.set("Access-Control-Allow-Origin", "*"); // Atur ke origin yang spesifik jika perlu
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  return response;
}

// Beri tahu Next.js untuk menggunakan middleware ini di semua route API
export const config = {
  matcher: "/api/:path*", // hanya akan diterapkan pada route API
};
