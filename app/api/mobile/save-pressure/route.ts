import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
    const auth = req.headers.get("authorization") || "";
    if (!auth.startsWith("Bearer ")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = auth.replace("Bearer ", "");
    const { score, rounds, details } = await req.json();

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as { sub: string };
        const userId = payload.sub;

        await prisma.practice.create({
            data: {
                userId,
                type: "ROUND_SIM",
                notes: `Pressure game - ${score} pts / ${rounds} rounds`,
                shots: {
                    create: details.map((d: any) => ({
                        club: d.club || "WEDGE_PW",
                        carry: d.carry,
                        total: d.total,
                        result: d.result,
                    })),
                },
            },
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
}
