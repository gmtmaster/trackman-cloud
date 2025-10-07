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

// ✅ ÚJ: POST metódus hozzáadása
export async function POST(req: Request) {
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

    const body = await req.json();

    // Normalizáló a klubnevekre
    function mapClubName(name: string): string {
        const n = name.toLowerCase();

        if (n.includes("driver")) return "DRIVER";
        if (n.includes("3 wood")) return "WOOD_3";
        if (n.includes("5 wood")) return "WOOD_5";
        if (n.includes("7 iron")) return "IRON_7";
        if (n.includes("6 iron")) return "IRON_6";
        if (n.includes("5 iron")) return "IRON_5";
        if (n.includes("8 iron")) return "IRON_8";
        if (n.includes("9 iron")) return "IRON_9";
        if (n.includes("pw")) return "PW";
        if (n.includes("sw")) return "SW";
        if (n.includes("lw")) return "LW";

        return "DRIVER"; // fallback
    }

    const normalizedClub = mapClubName(body.club);

    try {
        const shot = await prisma.shot.create({
            data: {
                userId: decoded.sub,
                club: normalizedClub,
                carry: body.carry,
                total: body.total,
                ballSpeed: body.ballSpeed,
                clubSpeed: body.clubSpeed,
                smash: body.smash,
                launchDeg: body.launchDeg,
                spin: body.spin,
                offlineM: body.offlineM,
                result: body.result,
            },
        });

        return NextResponse.json({ success: true, shot });
    } catch (err) {
        console.error("❌ Prisma insert error:", err);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
}
