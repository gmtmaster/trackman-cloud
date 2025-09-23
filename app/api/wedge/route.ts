import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const month = searchParams.get("month");
    const day = searchParams.get("day");

    const where: any = {
        club: { in: ["WEDGE_PW", "WEDGE_GW", "WEDGE_SW", "WEDGE_LW"] },
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
