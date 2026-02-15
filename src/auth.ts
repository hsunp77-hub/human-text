import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"

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
    },
    pages: {
        signIn: '/login',
    }
})
