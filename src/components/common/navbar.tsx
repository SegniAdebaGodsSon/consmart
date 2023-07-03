import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function NavbarComponent() {
    const { data: session } = useSession();
    let avatarText = "";

    if (session?.user.email) {
        avatarText = session.user.email.charAt(0);
    }

    if (session?.user.name) {
        avatarText = session.user.name.charAt(0);
    }
    return (
        <nav>
            <div className="navbar bg-base-100">
                <div className="flex-1">
                    <Link className="btn btn-ghost normal-case text-xl" href="/">Consmart</Link>
                </div>
                <div className="flex-none gap-2">
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
                                    <li><a onClick={() => void signOut()}>Sign out</a></li>
                                </ul>
                            </div>
                            :
                            <>
                                <Link className="btn btn-primary" href={'/api/auth/signin'}>Sign in</Link>
                            </>
                    }

                </div>
            </div>
        </nav>
    );
}