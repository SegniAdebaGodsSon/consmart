import { useState } from "react";
import ProjectSearchComponent, { SearchObject } from "~/components/user/project/searchComponent";
import { BsFillCalendarRangeFill, BsHouseAddFill } from 'react-icons/bs';
import { MdEngineering } from 'react-icons/md';
import { RiArrowGoBackFill } from 'react-icons/ri';
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

    const { data: session } = useSession();
    const userId = session?.user.id;
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

    const getRole = (index: number) => {
        if (!data || !session) {
            return "";
        }
        const project = data.projects[index];

        if (!project) return "";

        if (project.consultantId === userId) {
            return "Consultant";
        }
        else if (project.contractorId === userId) {
            return "Contractor";
        } else {
            return "Site Manager";
        }
    }

    return (
        <main>
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
                                    <div className="p-4 shadow-lg hover:shadow-2xl transition-all duration-200 ease-linear flex gap-4 flex-col border-t-2 border-neutral/25">
                                        <div className="flex justify-between">
                                            <div className="flex items-center gap-4">
                                                {
                                                    project.consultant.image ?
                                                        <div className="avatar">
                                                            <div className="w-14 rounded-full">
                                                                <img src={project.consultant.image} />
                                                            </div>
                                                        </div>
                                                        :
                                                        <div className="avatar placeholder">
                                                            <div className="bg-neutral-focus text-neutral-content rounded-full w-14 pb-2">
                                                                <span className="text-3xl font-medium">{project.consultant.name ? project.consultant.name?.charAt(0) : project.consultant.email?.charAt(0)}</span>
                                                            </div>
                                                        </div>
                                                }
                                                <p>
                                                    {`${!project.consultant.name ? "" : project.consultant.name} (${project.consultant.email})`}
                                                </p>
                                            </div>
                                            <div className="flex gap-2 items-center">
                                                <BsFillCalendarRangeFill />
                                                {`${project.startDate.toDateString()} - ${project.endDate.toDateString()}`}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <p className="text-2xl font-semibold mb-2">{project.name}{" "}
                                            </p>
                                            {
                                                project.status === "ACCEPTED" &&
                                                <div className="badge badge-success gap-2">
                                                    Accepted
                                                </div>
                                            }
                                            {
                                                project.status === "PENDING" &&
                                                <div className="badge badge-warning gap-2">
                                                    Pending
                                                </div>
                                            }
                                            {
                                                project.status === "REJECTED" &&
                                                <div className="badge badge-error gap-2">
                                                    Rejected
                                                </div>
                                            }
                                        </div>
                                        <div>
                                            <p>{project.description}</p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex gap-4 items-center">
                                                <p className="font-bold">
                                                    Contractor:
                                                </p>
                                                {
                                                    project.contractor.image ?
                                                        <div className="avatar">
                                                            <div className="w-10 rounded-full">
                                                                <img src={project.contractor.image} />
                                                            </div>
                                                        </div>
                                                        :
                                                        <div className="avatar placeholder">
                                                            <div className="bg-neutral-focus text-neutral-content rounded-full w-10 pb-2">
                                                                <span className="text-3xl font-medium">{project.contractor.name ? project.contractor.name?.charAt(0) : project.contractor.email?.charAt(0)}</span>
                                                            </div>
                                                        </div>
                                                }
                                                <p>
                                                    {`${!project.contractor.name ? "" : project.contractor.name} (${project.contractor.email})`}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MdEngineering size={24} />
                                                Your role: <span className="font-bold">{getRole(index)}</span>
                                            </div>
                                        </div>
                                    </div>
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