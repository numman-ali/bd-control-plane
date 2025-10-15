import { NextResponse, type NextRequest } from "next/server";

const publicPaths = ["/", "/login"];
const protectedPaths = ["/dashboard", "/graph", "/kanban", "/analytics", "/settings", "/admin", "/onboarding"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path requires authentication
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));

  if (!isProtectedPath) {
    return NextResponse.next();
  }

  // Check for session cookie (Better-Auth uses 'better-auth.session_token')
  const sessionToken = request.cookies.get("better-auth.session_token");

  if (!sessionToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
