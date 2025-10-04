// /app/api/mobile/login/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
    const { email, password } = await req.json();

    // 1. Használjuk ugyanazt a hitelesítést, mint a NextAuth
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // 2. Ugyanúgy generáljunk JWT-t, mint a NextAuth
    const token = jwt.sign(
        { sub: user.id, email: user.email },
        process.env.NEXTAUTH_SECRET!, // 🔥 FONTOS: ugyanaz, nem JWT_SECRET
        { expiresIn: "7d" }
    );

    return NextResponse.json({
        token,
        user: { email: user.email, name: user.name },
    });
}
