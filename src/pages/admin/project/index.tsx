import { useState } from "react";
import ProjectCard from "~/components/admin/project/projectCard";
import ProjectSearchComponent, { SearchObject } from "~/components/admin/project/projectSearchComponent";
import { RiArrowGoBackFill } from 'react-icons/ri';
import { api } from "~/utils/api";
import { useRouter } from "next/router";

interface GetAllInput {
    page: number,
    limit: number,
    search: string,
    orderBy: 'latest' | 'urgent',
}

export default function Page() {
    const [getAllInput, setGetAllInput] = useState<GetAllInput>({
        page: 1,
        limit: 25,
        search: '',
        orderBy: 'latest',
    })

    const { data, isLoading, error, refetch } = api.project.getAllAdmin.useQuery(getAllInput);
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
        <main className="container py-16">
            <section>
                <button className="btn btn-neutral" onClick={() => router.back()}>
                    <RiArrowGoBackFill />
                </button>
                <div className="my-3">
                    <p className="text-3xl font-semibold">
                        Projects Pending Approval
                    </p>
                </div>
            </section>
            <section className="flex justify-center">
                <ProjectSearchComponent cb={handleSubmit} />
            </section>

            <section>
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
                            {
                                data.projects.length === 0 &&
                                <p className="text-center">
                                    No projects found...
                                </p>
                            }
                            {data.projects.map((project, index) => (
                                <div key={project.id}>
                                    <ProjectCard project={project} refetch={refetch} />
                                    <div className="divider"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                }
            </section>
        </main>
    );
}