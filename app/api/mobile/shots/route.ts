// /app/api/web/shots/route.ts
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    const token = await getToken({ req });
    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = token.sub;

    const shots = await prisma.shot.findMany({
        where: { userId },
        select: {
            createdAt: true,
            club: true,
            carry: true,
            total: true,
            ballSpeed: true,
            spin: true,
            offlineM: true,
            launchDeg: true,
            result: true,
        },
        orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ shots });
}
