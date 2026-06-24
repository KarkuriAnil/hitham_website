import { NextResponse, type NextRequest } from "next/server";

const COOKIE_NAME = "hitham_admin_session";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname === "/admin/login";
  const isAdminRoute = pathname.startsWith("/admin");

  if (!isAdminRoute || isLoginPage) {
    return NextResponse.next();
  }

  const session = request.cookies.get(COOKIE_NAME);
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!session || !adminPassword || session.value !== adminPassword) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
