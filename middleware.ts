import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { verify } from "jsonwebtoken";
import type { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    if (pathname.startsWith("/api/mobile")) {
        // ✅ Allow mobile routes to handle their own auth check in Node runtime
        return NextResponse.next();
    }


    // 2️⃣ WEB (NextAuth) ROUTEOK
    const token = await getToken({ req });
    if (
        pathname.startsWith("/api/auth") ||
        pathname.startsWith("/login") ||
        pathname.startsWith("/register")
    ) {
        return NextResponse.next();
    }

    if (
        ["/dashboard", "/wedge", "/irons", "/driver", "/putt", "/rounds"].some((p) =>
            pathname.startsWith(p)
        )
    ) {
        if (!token) {
            const loginUrl = new URL("/login", req.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        // ✅ mobil api védelem
        "/api/mobile/:path*",

        // ✅ web API routes
        "/api/web/:path*",


        // ✅ webes oldalak
        "/dashboard/:path*",
        "/wedge/:path*",
        "/irons/:path*",
        "/driver/:path*",
        "/putt/:path*",
        "/rounds/:path*",
    ],
};
