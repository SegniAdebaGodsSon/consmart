import { useRouter } from 'next/router';
import { api } from '~/utils/api';
import { RiArrowGoBackFill } from 'react-icons/ri';
import { BsFillCalendarRangeFill } from 'react-icons/bs';
import moment from 'moment';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Page() {
    const { data: session } = useSession();
    const router = useRouter();
    const projectId = router.query.projectId as string;

    const { data: project, isLoading, error } = api.project.getOne.useQuery({
        id: projectId || ""
    });

    const { data: sitesData, isLoading: sitesIsLoading, error: sitesError } = api.site.getAll.useQuery({
        projectId
    });

    return (
        <main className='min-h-screen container'>
            <header className="flex items-center mt-4 gap-4">
                <button className="btn btn-neutral" onClick={() => router.back()}>
                    <RiArrowGoBackFill />
                </button>
            </header>
            {
                isLoading &&
                <section className='h-screen flex justify-center'>
                    <span className="loading loading-bars loading-lg"></span>
                </section>

            }
            {
                error &&
                <section className='h-screen flex justify-center items-center'>
                    <p className='text-error'>Error: {error.message}</p>
                </section>

            }

            {
                project &&
                <section className='max-w-4xl shadow-xl mx-auto p-6 rounded-3xl hover:shadow-md hover:rounded-none transition-all duration-200'>
                    <p className='text-3xl text-center my-4 font-semibold'>Project Info</p>
                    <div className='flex gap-10 items-center'>
                        <article>
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
                                    <div>
                                        <p>
                                            {`${!project.consultant.name ? "" : project.consultant.name} (${project.consultant.email})`}
                                        </p>
                                        <p className="text-xs">
                                            {moment(project.createdAt).fromNow()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2 items-center my-4">
                                <BsFillCalendarRangeFill />
                                {`${project.startDate.toDateString()} - ${project.endDate.toDateString()}`}
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
                                        Owner:
                                    </p>
                                    {
                                        project.owner.image ?
                                            <div className="avatar">
                                                <div className="w-10 rounded-full">
                                                    <img src={project.owner.image} />
                                                </div>
                                            </div>
                                            :
                                            <div className="avatar placeholder">
                                                <div className="bg-neutral-focus text-neutral-content rounded-full w-10 pb-2">
                                                    <span className="text-3xl font-medium">{project.owner.name ? project.owner.name?.charAt(0) : project.owner.email?.charAt(0)}</span>
                                                </div>
                                            </div>
                                    }
                                    <p>
                                        {`${!project.owner.name ? "" : project.owner.name} (${project.owner.email})`}
                                    </p>
                                </div>
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
                            </div>

                        </article>
                        <div className="divider divider-horizontal"></div>
                        <article>
                            <div className="radial-progress" style={{ "--value": "70", "--size": "12rem", "--thickness": "2rem" }}>70%</div>
                            <p className='text-center mt-4 text-success'>Overall progress</p>
                        </article>
                    </div>
                </section>
            }


            <section className='my-10'>
                {
                    session && project && session.user.id === project.contractorId &&
                    <div className='flex justify-center'>
                        <Link className='btn btn-outline btn-success btn-lg' href={`/project/${project.id}/site/create`}>Add a new site</Link>
                    </div>
                }
            </section>


            <section className='my-10'>
                <h1 className='text-5xl text-center'>Sites</h1>
                {
                    sitesIsLoading &&
                    <div className='h-screen flex justify-center'>
                        <span className="loading loading-bars loading-lg"></span>
                    </div >

                }
                {
                    sitesError &&
                    <div className='h-screen flex justify-center items-center'>
                        <p className='text-error'>Error: {sitesError.message}</p>
                    </div>
                }
                <div className='flex flex-wrap gap-5 my-8'>
                    {
                        project && sitesData &&
                        sitesData.map(site => (
                            <div key={site.id} className='p-5 flex flex-col gap-3 shadow-2xl hover:shadow-md transition-all duration-150 ease-linear border-primary/40 border-[1px] rounded-md'>
                                <p><span className='font-bold'>Name:</span> {site.name}</p>
                                <p><span className='font-bold'>Location:</span> {site.location}</p>
                                <p><span className='font-bold'>Tasks:</span> {site.tasks.length}</p>
                                <Link className='btn btn-outline btn-info' href={`/project/${project.id}/site/${site.id}`}>Details</Link>
                            </div>
                        ))
                    }
                </div>
            </section>


        </main>
    );
}