import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { prisma } from "@/lib/prisma"
import { authConfig } from "./auth.config"

// Debug logs for environment variables
console.log("--- AUTH DEBUG ---");
console.log("AUTH_SECRET Status:", process.env.AUTH_SECRET ? `Loaded (Length: ${process.env.AUTH_SECRET.length})` : "MISSING");
console.log("GOOGLE_CLIENT_ID Status:", process.env.GOOGLE_CLIENT_ID ? "Loaded" : "MISSING");
console.log("GOOGLE_CLIENT_SECRET Status:", process.env.GOOGLE_CLIENT_SECRET ? "Loaded" : "MISSING");
console.log("------------------");

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        Credentials({
            name: "Guest Login",
            credentials: {},
            async authorize(credentials) {
                console.log("Attempting Mock Login...");
                const user = { id: "mock-user-1", name: "Guest User", email: "guest@example.com" };
                console.log("Mock User returning:", user);
                return user;
            }
        })
    ],
    callbacks: {
        ...authConfig.callbacks,
        async jwt({ token, user, trigger, session }) {
            if (user) {
                // Initial login - fetch full user data
                try {
                    const fullUser = await prisma.user.findUnique({ where: { id: user.id } });
                    token.id = user.id;
                    token.isSignupCompleted = fullUser?.isSignupCompleted ?? false;
                } catch (e) {
                    console.error("Failed to fetch user data (likely DB connection error):", e);
                    token.id = user.id;
                    token.isSignupCompleted = false; // Fallback to false if DB fails
                }
            }
            if (trigger === "update" && session) {
                // Manual updates to session
                if (session.isSignupCompleted !== undefined) {
                    token.isSignupCompleted = session.isSignupCompleted;
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                (session.user as any).id = token.id as string;
                (session.user as any).isSignupCompleted = token.isSignupCompleted as boolean;
            }
            return session;
        },
    },
})
