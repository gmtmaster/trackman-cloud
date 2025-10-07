import { prisma } from "@/lib/prisma";

import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const month = searchParams.get("month");
    const day = searchParams.get("day");

    const where: any = {
        club: { in: ["DRIVER", "WOOD_3", "WOOD_5", "HYBRID"] },
    };

    if (q) {
        where.OR = [
            { result: { contains: q, mode: "insensitive" } },
            { user: { email: { contains: q, mode: "insensitive" } } },
        ];
    }

    if (month) {
        const year = new Date().getFullYear();
        const start = new Date(`${year}-${month}-01`);
        const end = new Date(year, parseInt(month), 1);
        where.createdAt = { gte: start, lt: end };
    }

    if (day) {
        const d = new Date(day);
        const next = new Date(d);
        next.setDate(d.getDate() + 1);
        where.createdAt = { gte: d, lt: next };
    }

    const shots = await prisma.shot.findMany({
        where,
        include: { user: true, practice: true },
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(shots);
}

export async function POST(req: Request) {
    const SECRET = process.env.NEXTAUTH_SECRET!;

    try {
        const token = await getToken({ req, secret: SECRET });

        if (!token || !token.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: token.email },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const body = await req.json();
        const {
            club,
            carry,
            total,
            ballSpeed,
            clubSpeed,
            smash,
            spin,
            launchDeg,
            offlineM,
            result,
            date,
        } = body;

        if (!club || !carry || !total) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        let createdAt: Date | undefined = undefined;
        if (date) {
            const d = new Date(date);
            if (Number.isNaN(d.getTime())) {
                return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
            }
            createdAt = d;
        }

        const newShot = await prisma.shot.create({
            data: {
                club: club as ClubType, // enum típus konverzió
                carry: parseFloat(carry),
                total: parseFloat(total),
                ballSpeed: parseFloat(ballSpeed || 0),
                clubSpeed: parseFloat(clubSpeed || 0),
                smash: parseFloat(smash || 0),
                spin: parseInt(spin || 0),
                launchDeg: parseFloat(launchDeg || 0),
                offlineM: parseFloat(offlineM || 0),
                result: result || "",
                user: { connect: { id: user.id } },
                ...(createdAt ? { createdAt } : {}),
            },
        });

        return NextResponse.json(newShot);
    } catch (error) {
        console.error("POST /api/driver error:", error);
        return NextResponse.json({ error: "Failed to add driver shot" }, { status: 500 });
    }
}
