import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {},
                password: {},
            },
            async authorize(credentials) {
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });
                if (!user || !user.passwordHash) return null;

                const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
                if (!isValid) return null;

                return { id: user.id, email: user.email, name: user.name };
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};
