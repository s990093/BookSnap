import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const token = request.cookies.get("authToken");
    console.log(`token from middlewaRE ${token?.value}`)

    // Redirect to login if no token is found
    if (!token) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    return NextResponse.next(); // Allow the request to proceed
}

// Protect specific routes (e.g., dashboard)
export const config = {
    matcher: [
        "/posts/:path*",
        "/design-templates/:path*",
        "/events/:path*",
        "/fonts/:path*",
        "/instagram-posts/:path*",
        "/post-types/:path*",

    ],
};