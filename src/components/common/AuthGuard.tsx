import { UserRole } from "@prisma/client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";


export default function AuthGuard(props: { children: any }) {
    const { data: session } = useSession();
    const router = useRouter();
    const currentPath = router.pathname;
    console.log("current path", currentPath);

    // not authenticated
    if (!session && currentPath !== "/" && !currentPath.includes('auth')) {
        return <main className="flex flex-col min-h-screen items-center justify-center gap-24">
            <p className="text-6xl">Unauthenticated</p>
            <Link className="btn btn-info btn-lg" href={'/api/auth/signin'}>Login</Link>
        </main>
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