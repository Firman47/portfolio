import { NextResponse, NextRequest } from "next/server";
import withAuth from "./middlewares/with-auth";

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

  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // const authToken = request.cookies.get("auth_token");
  // if (authToken && request.nextUrl.pathname === "/login") {
  //   return NextResponse.redirect(new URL("/admin/project", request.url));
  // }

  // if (
  //   !authToken &&
  //   (request.nextUrl.pathname.startsWith("/admin/project") ||
  //     request.nextUrl.pathname.startsWith("/admin/blog") ||
  //     request.nextUrl.pathname.startsWith("/admin/category"))
  // ) {
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }
  return withAuth(async () => {
    // Disini bisa lanjutkan ke middleware berikutnya jika tidak ada masalah autentikasi
    return NextResponse.next(); // Melanjutkan ke request berikutnya
  })(request);
}

export const config = {
  // Gunakan matcher yang sesuai dengan path yang ingin Anda lindungi
  matcher: ["/:path*"],
};
