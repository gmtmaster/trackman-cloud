import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { verify } from "jsonwebtoken";
import type { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    if (pathname.startsWith("/api/mobile")) {
        // ⛔️ Kivételek – login és register szabad
        if (pathname.startsWith("/api/mobile/login") || pathname.startsWith("/api/mobile/register")) {
            return NextResponse.next();
        }

        const auth = req.headers.get("authorization") || "";
        if (!auth.startsWith("Bearer ")) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }

        const token = auth.split(" ")[1];
        try {
            verify(token, process.env.NEXTAUTH_SECRET!); // 🔥 egységesen NEXTAUTH_SECRET
            return NextResponse.next();
        } catch {
            return new Response(JSON.stringify({ error: "Invalid token" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }
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

        // ✅ webes oldalak
        "/dashboard/:path*",
        "/wedge/:path*",
        "/irons/:path*",
        "/driver/:path*",
        "/putt/:path*",
        "/rounds/:path*",
    ],
};
