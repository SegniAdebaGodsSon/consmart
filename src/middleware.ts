import { NextRequest, NextResponse } from "next/server";
import { getSession } from "next-auth/react";
import { UserRole } from "@prisma/client";


// export { default } from "next-auth/middleware"

export function middleware(request: NextRequest) {
}


// export const config = {
//     matcher: [
//         '/admin/:path*', '/home', '/project/:path*',
//     ],
// }