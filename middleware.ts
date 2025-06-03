// middleware.ts
import { NextResponse, type NextRequest } from "next/server";

// Define paths that should bypass middleware
const publicRoutes = ["/login", "/api"];
const bypassPaths = ["/_next", "/favicon.ico", "/images", "/assets"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Bypass middleware for static assets and API routes
  if (
    bypassPaths.some((bp) => path.startsWith(bp)) ||
    path.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  const session = request.cookies.get("token")?.value;

  // Redirect unauthenticated users to signin for all non-public routes
  if (!publicRoutes.includes(path) && !session) {
    const signinUrl = new URL("/login", request.url);
    return NextResponse.redirect(signinUrl);
  }

  // Redirect authenticated users away from public routes (except API)
  if (publicRoutes.includes(path) && session && !path.startsWith("/api")) {
    return NextResponse.redirect(new URL("/transactions", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /_next (Next.js internals)
     * 2. /favicon.ico, /assets, /images (static files)
     * 3. /_next/static (static files)
     * 4. /_next/image (image optimization files)
     */
    "/((?!_next/static|_next/image|favicon.ico|assets|images).*)",
  ],
};
