import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function NavbarComponent() {
    const router = useRouter();
    const { data: session } = useSession();
    console.log(session);

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
                                    <div className="w-10 rounded-full">
                                        {/* <img src={user ? user.imageUrl : '/avatar.svg'} /> */}
                                    </div>
                                </label>
                                <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                                    <li><Link href="/profile">Profile</Link></li>
                                    {/* <li><a onClick={handleSignOut}>Sign out</a></li> */}
                                </ul>
                            </div>
                            :
                            <>
                                <Link className="link" href={'/sign-in'}>Sign in</Link> /
                                <Link className="link" href={'/sign-up'}>Sign up</Link>
                            </>
                    }

                </div>
            </div>
        </nav>
    );
}