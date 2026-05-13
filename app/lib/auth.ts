import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import { prisma } from "./prisma";
import { SignJWT } from "jose";
import bcrypt from "bcrypt";

// Helper to create a cross-app JWT for Inkwell Author Portal
async function createInkwellToken(user: any) {
    const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || "inkwell-super-secret-key-2026-change-in-production"
    );

    return await new SignJWT({
        userId: String(user.id || user.userId),
        email: user.email,
        name: user.username || user.email,
        role: user.role,
    })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("24h")
        .sign(secret);
}

// session interface
declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            username?: string | null;
            role?: string | null;
            token?: string | null;
        };
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing email or password");
                }

                try {


                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email },
                    });

                    if (!user) {
                        throw new Error("User not found in database");
                    }

                    const isPasswordValid = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );

                    if (!isPasswordValid) {
                        throw new Error("Invalid credentials");
                    }

                    const inkwellToken = await createInkwellToken(user);
                    console.log("NodePress: Login successful for:", user.email);

                    return {
                        id: String(user.id),
                        email: user.email,
                        name: user.username || user.email,
                        role: user.role,
                        inkwellToken,
                    };
                } catch (error) {
                    const err = error as Error;
                    console.error("NodePress Auth Error:", err.message);
                    throw new Error(err.message || "Authentication failed");
                }
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
        signOut: "/logout",
    },
    callbacks: {
        async jwt({ token, user, trigger }) {
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.role = (user as any).role;
                token.inkwellToken = (user as any).inkwellToken;
            }

            // Refresh role + token after session update (e.g. user became an author)
            if (trigger === "update" && token.email) {
                const dbUser = await prisma.user.findUnique({
                    where: { email: token.email as string },
                });

                if (dbUser) {
                    token.role = dbUser.role;
                    token.inkwellToken = await createInkwellToken(dbUser);
                    console.log("NodePress: Session refreshed for:", dbUser.email, "| Role:", dbUser.role);
                }
            }

            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string;
                session.user.name = token.name as string;
                session.user.role = token.role as string;
                session.user.token = token.inkwellToken as string;
            }
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
    cookies: {
        sessionToken: {
            name: `next-auth.session-token.nodepress`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: process.env.NODE_ENV === "production",
            },
        },
    },
};