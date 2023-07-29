import { useRouter } from "next/router";
import { useRef } from "react";
import Alert from "~/components/common/Alert";
import SearchUsers from "~/components/common/searchUsers";
import { api } from "~/utils/api";
import { RiArrowGoBackFill } from 'react-icons/ri';

export default function Create() {
    const nameRef = useRef<HTMLInputElement | null>(null);
    const locationRef = useRef<HTMLInputElement | null>(null);
    const siteManagerIdRef = useRef<string>();

    const router = useRouter();
    const projectId = router.query.projectId as string;

    const { mutate, data, isLoading, error, isSuccess } = api.site.create.useMutation()


    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const data = {
            name: nameRef.current?.value || "",
            location: locationRef.current?.value || "",
            projectId,
            managerId: siteManagerIdRef.current || "",
        }

        mutate(data as any);
    }

    setTimeout(() => {
        if (isSuccess) router.push(`/project/${projectId}`);
    }, 1000)

    return (
        <main className="container">

            {
                isSuccess && <Alert duration={3000} message="Site successfully created!" type="success" />
            }
            {
                error && <Alert duration={3000} message="Error creating a site!" type="error" />
            }

            <header className="flex items-center mt-4 gap-4">
                <button className="btn btn-neutral" onClick={() => router.back()}>
                    <RiArrowGoBackFill />
                </button>
            </header>

            <section className="flex w-full items-center justify-center flex-col my-4">
                <h1 className="text-2xl font-bold">Create new site</h1>
                <form className="flex flex-col gap-5 w-96 shadow-2xl p-8">
                    <div className="form-control w-full max-w-xs">
                        <label className="label">
                            <span className="label-text">Name</span>
                        </label>
                        <input ref={nameRef} type="text" placeholder="" className="input input-bordered w-full max-w-xs" />
                        <label className="label">
                            <span className="label-text text-error text-xs">{error?.data?.zodError?.fieldErrors.name}</span>
                        </label>
                    </div>

                    <div className="form-control w-full max-w-xs">
                        <label className="label">
                            <span className="label-text">Loacation</span>
                        </label>
                        <input ref={locationRef} type="text" placeholder="" className="input input-bordered w-full max-w-xs" />
                        <label className="label">
                            <span className="label-text text-error text-xs">{error?.data?.zodError?.fieldErrors.location}</span>
                        </label>
                    </div>

                    <div className="form-control w-full max-w-xs">
                        <label className="label">
                            <span className="label-text">Select site manager</span>
                        </label>
                        <SearchUsers placeholder="search by email or username" userIdRef={siteManagerIdRef} />

                        <label className="label">
                            <span className="label-text text-error text-xs">{error?.data?.zodError?.fieldErrors.managerId}</span>
                        </label>
                    </div>

                    <div className="form-control w-max">
                        <button className="btn btn-outline btn-primary" disabled={isLoading} onClick={handleSubmit}>
                            {isLoading ?
                                <>
                                    Creating{" "}
                                    <span className="loading loading-ring loading-md"></span>
                                </>
                                :
                                <>
                                    Create{" "}
                                </>
                            }
                        </button>
                    </div>
                </form>
            </section>
        </main >
    );
}