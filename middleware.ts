import { auth } from "@/auth"

export default auth((req) => {
    // auth.ts authorized callback handles the logic
})

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
