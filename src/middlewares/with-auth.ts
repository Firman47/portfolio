import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { jwtVerify } from "jose";

// Middleware autentikasi

const requireAuth = [
  "/profile",

  "/admin/project",
  "/admin/blog",
  "/admin/category",

  "/api/project",
  "/api/blog",
  "/api/category",
];

const onlyAdmin = [
  "/admin/project",
  "/admin/blog",
  "/admin/category",

  "/api/project",
  "/api/blog",
  "/api/category",
];

export default function withAuth(
  middleware: (req: NextRequest) => NextResponse | Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    const registerToken = req.cookies.get("auth_token")?.value;

    let decodedToken = null;

    if (registerToken) {
      try {
        const { payload } = await jwtVerify(
          registerToken,
          new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET)
        );
        decodedToken = payload;
      } catch (error) {
        console.error("JWT verification failed:", error);
        return NextResponse.redirect(new URL("/auth/signin", req.url));
      }
    }

    const pathname = req.nextUrl.pathname;
    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_JWT_SECRET,
    });

    if (
      pathname.startsWith("/_next/") ||
      pathname.startsWith("/static/") ||
      pathname.startsWith("/api/auth/") // Menambahkan pengecekan ini untuk API auth NextAuth
    ) {
      return NextResponse.next(); // Lewati middleware untuk permintaan ke _next, static, atau /api/auth/
    }

    if (
      (token?.verificationStatus === "unverified" &&
        pathname !== "/auth/verification") ||
      (decodedToken && pathname !== "/auth/verification")
    ) {
      const email1 = (decodedToken as jwt.JwtPayload)?.email as string; // Ambil email dari token
      const email2 = token?.email;
      const url = new URL(
        `/auth/verification/?email=${email1 || email2}`,
        req.url
      );

      return NextResponse.redirect(url);
    }

    // Penanganan halaman khusus untuk verifikasi
    if (pathname === "/auth/verification") {
      if (!registerToken) {
        const url = new URL("/auth/signin", req.url);
        return NextResponse.redirect(url);
      }

      if (token?.verificationStatus === "verified") {
        const url = new URL("/home", req.url);
        return NextResponse.redirect(url);
      }
    }

    if (pathname === "/auth/signin" || pathname === "/auth/signup") {
      if (token) {
        if (token.role === "admin") {
          const url = new URL("/admin/project", req.url);
          url.searchParams.set("callbackUrl", encodeURI(req.url));
          return NextResponse.redirect(url);
        } else {
          const url = new URL("/home", req.url);
          url.searchParams.set("callbackUrl", encodeURI(req.url));
          return NextResponse.redirect(url);
        }
      }
    }

    if (requireAuth.includes(pathname)) {
      if (!token) {
        const url = new URL("/auth/signin", req.url);
        url.searchParams.set("callbackUrl", encodeURI(req.url));
        return NextResponse.redirect(url);
      }
    }

    if (token?.role !== "admin" && onlyAdmin.includes(pathname)) {
      const url = new URL("/home", req.url);
      url.searchParams.set("callbackUrl", encodeURI(req.url));
      return NextResponse.redirect(url);
    }

    return middleware(req);
  };
}
