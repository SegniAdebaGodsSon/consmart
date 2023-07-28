import { UserRole } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";


export default function AuthGuard(props: { children: any }) {
    const { data: session } = useSession();
    const router = useRouter();
    const currentPath = router.pathname;
    console.log("current path", currentPath);

    // not authenticated
    if (!session && currentPath !== "/") {
        if (typeof window !== 'undefined') {
            router.push(`api/auth/signin`);
        }
    }

    if (session && currentPath === '/') {
        if (typeof window !== 'undefined') {
            if (session.user.role === UserRole.USER) {
                router.push('/home');
            }
            if (session.user.role === UserRole.ADMIN) {
                router.push('/admin')
            }
        }
    }



    // not authorized - protecting admin
    if (session && session.user.role === UserRole.USER && currentPath.startsWith('/admin')) {
        if (typeof window !== 'undefined') router.push('/403');
    }

    if (session && session.user.role === UserRole.ADMIN && !currentPath.startsWith('/admin') && currentPath !== '/') {
        if (typeof window !== 'undefined') router.push('/403');
    }

    return (
        props.children
    );
}