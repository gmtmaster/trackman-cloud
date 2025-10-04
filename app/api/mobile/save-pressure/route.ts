import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

function getUserId(req: Request) {
    const auth = req.headers.get("authorization") || "";
    const token = auth.replace("Bearer ", "");
    const payload = jwt.verify(token, JWT_SECRET) as { sub: string };
    return payload.sub;
}

export async function POST(req: Request) {
    try {
        const userId = getUserId(req);
        const { score, rounds, details } = await req.json();

        // mentsük el a játékot a "Practice" + "Shot" struktúrában
        const practice = await prisma.practice.create({
            data: {
                userId,
                type: "ROUND_SIM",
                notes: "Pressure Game",
                shots: {
                    create: details.map((d: any) => ({
                        club: d.club || "IRON_7",
                        carry: d.actual,
                        total: d.actual,
                        result: `target ${d.target}, score ${d.points.toFixed(1)}`,
                    })),
                },
            },
            include: { shots: true },
        });

        return NextResponse.json({ ok: true, practice });
    } catch (e: any) {
        console.error(e);
        return NextResponse.json({ error: e.message }, { status: 400 });
    }
}
