import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import { NextResponse } from "next/server"

export default NextAuth(authConfig).auth((req) => {
    const isLoggedIn = !!req.auth
    const { nextUrl } = req

    // @ts-ignore
    const isSignupCompleted = req.auth?.user?.isSignupCompleted

    const isSignupPage = nextUrl.pathname.startsWith('/signup')
    const isLoginPage = nextUrl.pathname.startsWith('/login')
    const isWritePage = nextUrl.pathname.startsWith('/write')

    // If logged in but signup not completed, redirect to /signup
    if (isLoggedIn && !isSignupCompleted && !isSignupPage && !isLoginPage && isWritePage) {
        return NextResponse.redirect(new URL("/signup", nextUrl))
    }

    // If logged in and signup completed, and trying to access /signup, redirect to /write
    if (isLoggedIn && isSignupCompleted && isSignupPage) {
        return NextResponse.redirect(new URL("/write", nextUrl))
    }

    return NextResponse.next()
})

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
