// /app/api/web/shots/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
    const auth = req.headers.get("authorization");
    if (!auth || !auth.startsWith("Bearer ")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = auth.split(" ")[1];
    let decoded: any;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    console.log("🧑 userId from token:", decoded.sub);

    const shots = await prisma.shot.findMany({
        where: { userId: decoded.sub },
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
