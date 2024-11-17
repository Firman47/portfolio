import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next(); // Membuat response lanjutan

  // Tambahkan Header CORS
  response.headers.set("Access-Control-Allow-Origin", "http://localhost:3000");
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

  // Ambil nilai cookie auth_token
  const authToken = request.cookies.get("auth_token");
  // Cek apakah pengguna mencoba mengakses halaman login dan sudah ada token (sudah login)
  if (authToken && request.nextUrl.pathname === "/login") {
    // Jika sudah login, arahkan ke halaman utama ("/") atau halaman lain yang sesuai
    return NextResponse.redirect(new URL("/admin/project", request.url));
  }

  // Cek apakah pengguna mencoba mengakses halaman admin atau project tanpa token (belum login)
  if (
    !authToken &&
    (request.nextUrl.pathname.startsWith("/admin/project") ||
      request.nextUrl.pathname.startsWith("/admin/blog"))
  ) {
    // Jika belum login, arahkan ke halaman login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Jika tidak ada masalah, lanjutkan ke halaman yang diminta
  return NextResponse.next();
}

export const config = {
  // Gunakan matcher yang sesuai dengan path yang ingin Anda lindungi
  matcher: ["/admin/:path*", "/api/:path*", "/project/:path*", "/login"],
};
