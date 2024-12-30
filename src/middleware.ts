import { NextResponse, NextRequest } from "next/server";
// import { validateToken } from "./lib/validateToken";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next(); // Membuat response lanjutan

  // Tambahkan Header CORS
  response.headers.set(
    "Access-Control-Allow-Origin",
    "http://localhost:3000, https://firmanrf.vercel.app"
  );
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  // Preflight Request (OPTIONS)
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: response.headers,
    });
  }

  const authToken = request.cookies.get("auth_token");
  if (authToken && request.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/admin/project", request.url));
  }

  if (
    !authToken &&
    (request.nextUrl.pathname.startsWith("/admin/project") ||
      request.nextUrl.pathname.startsWith("/admin/blog"))
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Gunakan matcher yang sesuai dengan path yang ingin Anda lindungi
  matcher: ["/:path*"],
};
