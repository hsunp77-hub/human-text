import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { prisma } from "@/lib/prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
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
    session: {
        strategy: "jwt",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
            const isOnWritePage = nextUrl.pathname.startsWith('/write')
            if (isOnWritePage) {
                if (isLoggedIn) return true
                return false // Redirect unauthenticated users to login page
            }
            return true
        },
        async jwt({ token, user, trigger, session }) {
            if (user) {
                // Initial login - fetch full user data
                const fullUser = await prisma.user.findUnique({ where: { id: user.id } });
                token.id = user.id;
                token.isSignupCompleted = fullUser?.isSignupCompleted ?? false;
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
    pages: {
        signIn: '/login',
    }
})
