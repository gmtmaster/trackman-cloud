import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET!;

function getUserIdFromAuth(req: Request) {
    const auth = req.headers.get("authorization") || "";
    if (!auth.startsWith("Bearer ")) throw new Error("Unauthorized");
    const token = auth.replace("Bearer ", "");
    const payload = jwt.verify(token, JWT_SECRET) as { sub: string };
    return payload.sub;
}

export async function GET(req: Request) {
    try {
        const userId = getUserIdFromAuth(req);
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, name: true },
        });
        if (!user) throw new Error("User not found");
        return NextResponse.json({ user });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 401 });
    }
}
