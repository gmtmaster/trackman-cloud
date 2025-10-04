import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const token = await getToken({ req });
    const { pathname } = req.nextUrl;

    // 🧩 Engedjük át az auth és login route-okat, hogy ne loopoljanak
    if (pathname.startsWith("/api/auth") || pathname.startsWith("/login")) {
        return NextResponse.next();
    }

    // 🔒 Ha nincs token (nincs bejelentkezve)
    if (!token) {
        const loginUrl = new URL("/login", req.url);
        return NextResponse.redirect(loginUrl);
    }

    // ✅ Minden más mehet tovább
    return NextResponse.next();
}

// Csak ezekre a route-okra fusson a middleware
export const config = {
    matcher: [
        "/dashboard/:path*",
        "/wedge/:path*",
        "/irons/:path*",
        "/driver/:path*",
        "/putt/:path*",
        "/rounds/:path*",
    ],
};
