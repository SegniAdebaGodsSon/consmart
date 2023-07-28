import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { UserRole } from "~/common/types";
import DayNightToggle from 'react-day-and-night-toggle'
import { useTheme } from "next-themes";

export default function NavbarComponent() {
    const { data: session } = useSession();
    const router = useRouter();
    const { theme, setTheme } = useTheme()

    let avatarText = "";

    if (session?.user.email) {
        avatarText = session.user.email.charAt(0);
    }

    if (session?.user.name) {
        avatarText = session.user.name.charAt(0);
    }

    function logout() {
        signOut();
        router.push('/');
    }
    return (
        <nav className="shadow-xl container ">
            <div className="navbar bg-base-100">
                <div className="flex-1 text-primary">
                    {
                        session && session.user.role === UserRole.USER &&
                        <Link className="btn btn-ghost normal-case text-3xl" href="/home">Consmart</Link>
                    }
                    {
                        session && session.user.role === UserRole.ADMIN &&
                        <Link className="btn btn-ghost normal-case text-3xl" href="/admin">Consmart</Link>
                    }
                    {
                        !session &&
                        <Link className="btn btn-ghost normal-case text-3xl" href="/">Consmart</Link>
                    }
                </div>

                <div className="flex gap-5">
                    <div className="flex gap-2">
                        {
                            session && session.user.role === UserRole.USER &&
                            <Link className="btn" href={'/project'}>Projects</Link>
                        }
                        {
                            session && session.user.role === UserRole.ADMIN &&
                            <Link className="btn" href={'/admin'}>Dashboard</Link>
                        }
                        {
                            session && session.user.role === UserRole.ADMIN &&
                            <Link className="btn" href={'/admin/project'}>Projects</Link>
                        }
                        {
                            session && session.user.role === UserRole.ADMIN &&
                            <Link className="btn" href={'/admin/user'}>Users</Link>
                        }
                    </div>
                    {
                        session ?
                            <div className="dropdown dropdown-end">
                                <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                                    {
                                        !session.user.image ?
                                            <div className="avatar placeholder">
                                                <div className="bg-neutral-focus text-neutral-content rounded-full w-10">
                                                    <span className="text-xl pb-1">{avatarText}</span>
                                                </div>
                                            </div>
                                            :
                                            <div className="avatar">
                                                <div className="w-10 rounded-full">
                                                    <img src={session.user.image} alt={session.user.name ? session.user.name : ""} />
                                                </div>
                                            </div>
                                    }
                                </label>
                                <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                                    <li><Link href="/profile">Profile</Link></li>
                                    <li><a onClick={() => logout()}>Sign out</a></li>
                                </ul>
                            </div>
                            :
                            <>
                                <Link className="btn btn-primary" href={'/api/auth/signin'}>Sign in</Link>
                            </>
                    }
                    <DayNightToggle
                        onChange={() => setTheme(theme === "light" ? "dark" : "light")}
                        checked={theme === "dark"}
                        size={20}
                    />
                </div>
            </div>
        </nav>
    );
}