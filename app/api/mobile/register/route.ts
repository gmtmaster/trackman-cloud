import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
    const { name, email, password } = await req.json();

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: { name, email, passwordHash },
    });

    const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET!, { expiresIn: "7d" });
    return NextResponse.json({ token, user: { email: user.email, name: user.name } });
}
