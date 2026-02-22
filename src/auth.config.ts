import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            return true // Allow all access — app uses localStorage-based anonymous auth
        },
    },
    providers: [], // Providers often have Node.js dependencies, so we add them in auth.ts
    secret: process.env.AUTH_SECRET,
    trustHost: true,
    debug: true,
} satisfies NextAuthConfig
