import { useRouter } from 'next/router';
import { RiArrowGoBackFill } from 'react-icons/ri';
import { useSession } from 'next-auth/react';

export default function Page() {
    const { data: session } = useSession();
    const router = useRouter();

    return (
        <>
            <header>
                <title>Profile</title>
            </header>
            <main className='min-h-screen container'>
                <header className="flex items-center mt-4 gap-4">
                    <button className="btn btn-neutral" onClick={() => router.back()}>
                        <RiArrowGoBackFill />
                    </button>
                </header>



            </main>
        </>
    );
}