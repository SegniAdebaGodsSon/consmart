import { useState } from "react";
import ProjectSearchComponent, { SearchObject } from "~/components/user/project/searchComponent";
import { BsHouseAddFill } from 'react-icons/bs';
import { RiArrowGoBackFill } from 'react-icons/ri';
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProjectCard from "~/components/user/project/projectCard";

interface GetAllInput {
    page: number,
    limit: number,
    search: string,
    orderBy: 'latest' | 'urgent',
    role: 'contractor' | 'consultant' | 'site manager' | 'all',
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'ALL'
}

export default function ProjectPage() {
    const [getAllInput, setGetAllInput] = useState<GetAllInput>({
        page: 1,
        limit: 25,
        search: '',
        orderBy: 'latest',
        role: 'all',
        status: 'ALL'
    })


    const { data, isLoading, error, refetch } = api.project.getAll.useQuery(getAllInput);

    const router = useRouter();

    const handleSubmit = (searchObject: SearchObject) => {

        setGetAllInput((prevState: GetAllInput) => ({
            ...searchObject,
            page: prevState.page,
            limit: prevState.limit,
        } as GetAllInput));
        refetch();
    }



    return (
        <main className="container">
            <div className="my-3 flex justify-between">
                <button className="btn btn-neutral" onClick={() => router.back()}>
                    <RiArrowGoBackFill />
                </button>

                <Link className="btn btn-success" href={'/project/create'}><BsHouseAddFill /> New Project</Link>
            </div>

            <section className="flex justify-center mt-4">
                <ProjectSearchComponent cb={handleSubmit} />
            </section>
            <section className="mt-4">
                {
                    isLoading &&
                    <div className="h-screen flex justify-center items-center">
                        <span className="loading loading-bars loading-lg"></span>
                    </div>
                }

                {
                    data &&
                    <div>
                        <div>
                            <p>Total results: {data.total}</p>
                        </div>
                        <div className="">
                            {data.projects.map((project, index) => (
                                <>
                                    <ProjectCard key={project.id} project={project} />
                                    <div className="divider"></div>
                                </>
                            ))}
                        </div>
                    </div>
                }

            </section>
        </main>
    );
}