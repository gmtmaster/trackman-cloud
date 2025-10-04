import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "❌ undefined",
        length: process.env.NEXTAUTH_SECRET?.length || 0,
        envLoaded: !!process.env.NODE_ENV,
    });
}
