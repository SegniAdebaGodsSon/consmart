import { UserRole } from "@prisma/client";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ReactNode } from "react";

const publicPaths = ["/", "/api/auth/"];

export default function AuthGuard(props: { children: any }) {
    const { data: session } = useSession();
    const router = useRouter();
    const currentPath = router.pathname;
    return (
        props.children
    );
}