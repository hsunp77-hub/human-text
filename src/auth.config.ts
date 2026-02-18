import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    pages: {
        signIn: '/login',
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
    },
    providers: [], // Providers often have Node.js dependencies, so we add them in auth.ts
    secret: process.env.AUTH_SECRET,
    trustHost: true,
    debug: true,
} satisfies NextAuthConfig
