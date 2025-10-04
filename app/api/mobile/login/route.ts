import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
    const { email, password } = await req.json();
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
    return NextResponse.json({ token, user: { id: user.id, email: user.email, name: user.name } });
}
