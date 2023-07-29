import Link from "next/link";
import ProjectCard from "~/components/user/project/projectCard";
import { api } from "~/utils/api";

export default function UserHome() {

    const { data: ownerData, isLoading: ownerIsLoading, error: ownerError } = api.project.getAll.useQuery({
        page: 1,
        limit: 3,
        search: '',
        orderBy: 'latest',
        role: 'owner',
        status: 'ALL'
    });

    const { data: consultantData, isLoading: consultantIsLoading, error: consultantError } = api.project.getAll.useQuery({
        page: 1,
        limit: 3,
        search: '',
        orderBy: 'latest',
        role: 'consultant',
        status: 'ALL'
    });

    const { data: contractorData, isLoading: contractorIsLoading, error: contractorError } = api.project.getAll.useQuery({
        page: 1,
        limit: 3,
        search: '',
        orderBy: 'latest',
        role: 'contractor',
        status: 'ALL'
    });

    const { data: siteManagerData, isLoading: siteManagerIsLoading, error: siteManagerError } = api.project.getAll.useQuery({
        page: 1,
        limit: 3,
        search: '',
        orderBy: 'latest',
        role: 'site manager',
        status: 'ALL'
    });

    return (
        <main className="container">
            <section className="my-10">
                <h1 className="text-4xl font-semibold text-center my-3 text-primary">Projects you own</h1>
                <div>
                    {
                        ownerIsLoading &&
                        <div className="flex justify-center items-center">
                            <span className="loading loading-bars loading-lg text-accent"></span>
                        </div>
                    }
                    {
                        ownerData &&
                        <div className="">
                            {
                                ownerData.projects.map((project, index) => (
                                    <>
                                        <ProjectCard key={project.id} project={project} />
                                        <div className="divider"></div>
                                    </>
                                ))
                            }
                        </div>
                    }
                    {
                        ownerData && ownerData.projects.length === 0 ?
                            <p className="text-center text-warning">You do not own any projects!</p>
                            :
                            <div className="flex justify-end">
                                <Link href={'/project'} className="btn btn-info btn-outline">More</Link>
                            </div>

                    }
                    {
                        ownerError &&
                        <p className="text-center text-error">Error loading projects!</p>
                    }
                </div>
            </section>

            <section className="my-10">
                <h1 className="text-4xl font-semibold text-center my-3 text-primary">Projects you are a consultant in</h1>
                <div>
                    {
                        consultantIsLoading &&
                        <div className="flex justify-center items-center">
                            <span className="loading loading-bars loading-lg text-accent"></span>
                        </div>
                    }
                    {
                        consultantData &&
                        <div className="">
                            {
                                consultantData.projects.map((project, index) => (
                                    <>
                                        <ProjectCard key={project.id} project={project} />
                                        <div className="divider"></div>
                                    </>
                                ))
                            }
                        </div>
                    }
                    {
                        consultantData && consultantData.projects.length === 0 ?
                            <p className="text-center text-warning">You are not a consultant in any project!</p>
                            :
                            <div className="flex justify-end">
                                <Link href={'/project'} className="btn btn-info btn-outline">More</Link>
                            </div>
                    }
                    {
                        consultantError &&
                        <p className="text-center text-error">Error loading projects!</p>
                    }
                </div>
            </section>

            <section className="my-10">
                <h1 className="text-4xl font-semibold text-center my-3 text-primary">Projects you are a contractor in</h1>
                <div>
                    {
                        contractorIsLoading &&
                        <div className="flex justify-center items-center">
                            <span className="loading loading-bars loading-lg text-accent"></span>
                        </div>
                    }
                    {
                        contractorData &&
                        <div className="">
                            {
                                contractorData.projects.map((project, index) => (
                                    <>
                                        <ProjectCard key={project.id} project={project} />
                                        <div className="divider"></div>
                                    </>
                                ))
                            }
                        </div>
                    }
                    {
                        contractorData && contractorData.projects.length === 0 ?
                            <p className="text-center text-warning">You are not a contractor in any project!</p>
                            :
                            <div className="flex justify-end">
                                <Link href={'/project'} className="btn btn-info btn-outline">More</Link>
                            </div>
                    }
                    {
                        contractorError &&
                        <p className="text-center text-error">Error loading projects!</p>
                    }
                </div>
            </section>

            <section className="my-10">
                <h1 className="text-4xl font-semibold text-center my-3 text-primary">Projects you are a site manager in</h1>
                <div>
                    {
                        siteManagerIsLoading &&
                        <div className="flex justify-center items-center">
                            <span className="loading loading-bars loading-lg text-accent"></span>
                        </div>
                    }
                    {
                        siteManagerData &&
                        <div className="">
                            {
                                siteManagerData.projects.map((project, index) => (
                                    <>
                                        <ProjectCard key={project.id} project={project} />
                                        <div className="divider"></div>
                                    </>
                                ))
                            }
                        </div>
                    }
                    {
                        siteManagerData && siteManagerData.projects.length === 0 ?
                            <p className="text-center text-warning">You are not a site manager in any project!</p>
                            :
                            <div className="flex justify-end">
                                <Link href={'/project'} className="btn btn-info btn-outline">More</Link>
                            </div>
                    }
                    {
                        siteManagerError &&
                        <p className="text-center text-error">Error loading projects!</p>

                    }
                </div>
            </section>
        </main>
    );
}