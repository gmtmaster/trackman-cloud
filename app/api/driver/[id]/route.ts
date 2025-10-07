import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const SECRET = process.env.NEXTAUTH_SECRET!;

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
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

        const shot = await prisma.shot.findUnique({ where: { id: params.id } });
        if (!shot || shot.userId !== user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        await prisma.shot.delete({ where: { id: params.id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE /api/driver/[id] error:", error);
        return NextResponse.json({ error: "Failed to delete driver shot" }, { status: 500 });
    }
}
