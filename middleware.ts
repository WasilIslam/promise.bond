import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const publicRoutes = ["/", "/verify-email"];
const authRoutes = ["/dashboard", "/matches", "/profile"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Check for auth token
  const token = request.cookies.get("auth-token")?.value;

  // Redirect to login if no token and trying to access protected route
  if (!token && authRoutes.some((route) => pathname.startsWith(route))) {
    const loginUrl = new URL("/", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Verify token if present
  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
      await jwtVerify(token, secret);

      // If logged in and trying to access public routes, redirect to dashboard
      if (publicRoutes.includes(pathname) && pathname !== "/verify-email") {
        const dashboardUrl = new URL("/dashboard", request.url);
        return NextResponse.redirect(dashboardUrl);
      }

      return NextResponse.next();
    } catch (error) {
      // Invalid token, clear it and redirect to login
      const response = NextResponse.redirect(new URL("/", request.url));
      response.cookies.delete("auth-token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
