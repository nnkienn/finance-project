// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const at = req.cookies.get("accessToken")?.value;
  const { pathname } = req.nextUrl;

  const isAuthPage =
    pathname.startsWith("/signin") || pathname.startsWith("/signup");
  const isProtected =
    pathname.startsWith("/homepage") || pathname.startsWith("/category");

  // chưa login mà vào protected route
  if (!at && isProtected) {
    const url = req.nextUrl.clone();
    url.pathname = "/signin";
    return NextResponse.redirect(url);
  }

  // đã login mà vào signin/signup
  if (at && isAuthPage) {
    const url = req.nextUrl.clone();
    url.pathname = "/homepage";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/signin", "/signup", "/homepage/:path*", "/category/:path*"],
};
