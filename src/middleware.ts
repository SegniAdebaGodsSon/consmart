import { NextRequest, NextResponse } from "next/server";
import { getSession } from "next-auth/react";
import { UserRole } from "@prisma/client";

// only runs on pages except the landing page "/"
export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*|/|api/auth/signin|401|403)',
    ],
}

export async function middleware(request: NextRequest, response: NextResponse) {
    const { pathname } = request.nextUrl;
    const matchesAdminPath = pathname.startsWith("/admin");

    // Authentication 
    // const session = await getSession();
    // console.log("session", session);

    // if (!session) {
    //     const url = new URL(`/401`, request.url);
    //     // url.searchParams.set("callbackUrl", encodeURI(request.url));
    //     return NextResponse.redirect(url);
    // }

    // const userRole = session.user.role;

    // // Authorization: Protect admin routes from users
    // if (matchesAdminPath && userRole !== UserRole.ADMIN) {
    //     const url = new URL(`/403`, request.url);
    //     return NextResponse.rewrite(url);
    // }

    // return NextResponse.next();
}