import { FiUser } from 'react-icons/fi';
import { HiOutlineBuildingOffice2 } from 'react-icons/hi2';
import { MdConstruction } from 'react-icons/md';
import { api } from '~/utils/api';

export default function AdminPage() {

    const { data: basicStatsData, isLoading: basicStatsIsLoading, error: basicStatsError } = api.stats.getBasicStats.useQuery();
    const { data: projectStatsData, isLoading: projectStatsIsLoading, error: projectStatsError } = api.stats.getProjectStats.useQuery();
    const { data: userStatsData, isLoading: userStatsIsLoading, error: userStatsError } = api.stats.getUserStats.useQuery();

    return (
        <main className='min-h-screen'>
            <p className="text-3xl">Admin Dashboard</p>

            <section className="flex justify-center">
                <div>
                    <p className='text-2xl font-bold text-center'>Basic Stats</p>
                    <div className="stats shadow-xl hover:shadow-md transition-all duration-200 ease-linear">
                        <div className="stat">
                            <div className="stat-figure text-primary">
                                <FiUser size={34} />
                            </div>
                            <div className="stat-title">Total Users</div>
                            <div className="stat-value text-primary">
                                {
                                    basicStatsIsLoading &&
                                    <span className="loading loading-ring loading-sm"></span>
                                }
                                {
                                    basicStatsData &&
                                    basicStatsData.usersCount
                                }
                            </div>
                            <div className="stat-desc">21% more than last month</div>
                        </div>

                        <div className="stat">
                            <div className="stat-figure text-secondary">
                                <HiOutlineBuildingOffice2 size={34} />
                            </div>
                            <div className="stat-title">Total Projects</div>
                            <div className="stat-value text-secondary">
                                {
                                    basicStatsIsLoading &&
                                    <span className="loading loading-ring loading-sm"></span>
                                }
                                {
                                    basicStatsData &&
                                    basicStatsData.projectsCount
                                }
                            </div>
                            <div className="stat-desc">2% more than last month</div>
                        </div>

                        <div className="stat">
                            <div className="stat-figure text-secondary">
                                <MdConstruction size={34} />
                            </div>
                            <div className="stat-title">Total Sites</div>
                            <div className="stat-value text-secondary">
                                {
                                    basicStatsIsLoading &&
                                    <span className="loading loading-ring loading-sm"></span>
                                }
                                {
                                    basicStatsData &&
                                    basicStatsData.sitesCount
                                }
                            </div>
                            <div className="stat-desc">21% more than last month</div>
                        </div>
                    </div>
                </div>
            </section>


            <section className="flex justify-center mt-8">
                <div>
                    <p className='text-2xl font-bold text-center'>Projects Stats</p>
                    <div className="stats shadow-xl hover:shadow-md transition-all duration-200 ease-linear">
                        <div className="stat place-items-center">
                            <div className="stat-title">Accepted</div>
                            <div className="stat-value text-success">
                                {
                                    projectStatsIsLoading &&
                                    <span className="loading loading-ring loading-sm"></span>
                                }
                                {
                                    projectStatsData &&
                                    projectStatsData.acceptedProjectsCount
                                }
                            </div>
                            <div className="stat-desc">Total accepted projects</div>
                        </div>

                        <div className="stat place-items-center">
                            <div className="stat-title">Pending</div>
                            <div className="stat-value text-warning">
                                {
                                    projectStatsIsLoading &&
                                    <span className="loading loading-ring loading-sm"></span>
                                }
                                {
                                    projectStatsData &&
                                    projectStatsData.pendingProjectsCount
                                }
                            </div>
                            <div className="stat-desc">Total projects pending admin approval</div>
                        </div>

                        <div className="stat place-items-center">
                            <div className="stat-title">Rejected</div>
                            <div className="stat-value text-error">
                                {
                                    projectStatsIsLoading &&
                                    <span className="loading loading-ring loading-sm"></span>
                                }
                                {
                                    projectStatsData &&
                                    projectStatsData.rejectedProjectsCount
                                }
                            </div>
                            <div className="stat-desc">Total projects rejected</div>
                        </div>
                    </div>
                </div>
            </section>


            <section className="flex justify-center mt-8">
                <div>
                    <p className='text-2xl font-bold text-center'>User Stats</p>
                    <div className="stats shadow-xl hover:shadow-md transition-all duration-200 ease-linear">

                        {
                            userStatsIsLoading &&
                            <div className="stat">
                                <div className="stat-figure text-secondary">
                                    <div className="avatar ">
                                        <div className="w-16 rounded-full">
                                            <img src="/avatar.png" />
                                        </div>
                                    </div>
                                </div>
                                <div className="stat-value">
                                    <span className="loading loading-ring loading-sm"></span>
                                </div>
                                <div className="stat-title">Consultant</div>
                                <div className="stat-desc text-secondary">Most projects as a consultant</div>
                            </div>
                        }

                        {
                            userStatsData &&
                            <div className="stat">
                                <div className="stat-figure text-secondary">
                                    {
                                        userStatsData.mostProjectsAsConsultant[0]?.image ?
                                            <div className="avatar">
                                                <div className="w-14 rounded-full">
                                                    <img src={userStatsData.mostProjectsAsConsultant[0].image} />
                                                </div>
                                            </div>
                                            :
                                            <div className="avatar placeholder">
                                                <div className="bg-neutral-focus text-neutral-content rounded-full w-14 pb-2">
                                                    <span className="text-3xl font-medium">{userStatsData.mostProjectsAsConsultant[0]?.name ? userStatsData.mostProjectsAsConsultant[0]?.name?.charAt(0) : userStatsData.mostProjectsAsConsultant[0]?.email?.charAt(0)}</span>
                                                </div>
                                            </div>
                                    }
                                </div>
                                <div className="stat-value">{userStatsData.mostProjectsAsConsultant[0]?.consultantRoleProjects.length}</div>
                                <div className="stat-title">Consultant</div>
                                <div className="stat-title font-bold">{userStatsData.mostProjectsAsConsultant[0]?.name}</div>
                                <div className='stat-desc'>({userStatsData.mostProjectsAsConsultant[0]?.email})</div>
                                <div className="stat-desc text-secondary">Most projects as a consultant</div>
                            </div>
                        }


                        {
                            userStatsIsLoading &&
                            <div className="stat">
                                <div className="stat-figure text-secondary">
                                    <div className="avatar ">
                                        <div className="w-16 rounded-full">
                                            <img src="/avatar.png" />
                                        </div>
                                    </div>
                                </div>
                                <div className="stat-value">
                                    <span className="loading loading-ring loading-sm"></span>
                                </div>
                                <div className="stat-title">Contractor</div>
                                <div className="stat-desc text-secondary">Most projects as a constractor</div>
                            </div>
                        }

                        {
                            userStatsData &&
                            <div className="stat">
                                <div className="stat-figure text-secondary">
                                    {
                                        userStatsData.mostProjectsAsContractor[0]?.image ?
                                            <div className="avatar">
                                                <div className="w-14 rounded-full">
                                                    <img src={userStatsData.mostProjectsAsContractor[0].image} />
                                                </div>
                                            </div>
                                            :
                                            <div className="avatar placeholder">
                                                <div className="bg-neutral-focus text-neutral-content rounded-full w-14 pb-2">
                                                    <span className="text-3xl font-medium">{userStatsData.mostProjectsAsContractor[0]?.name ? userStatsData.mostProjectsAsContractor[0]?.name?.charAt(0) : userStatsData.mostProjectsAsContractor[0]?.email?.charAt(0)}</span>
                                                </div>
                                            </div>
                                    }
                                </div>
                                <div className="stat-value">{userStatsData.mostProjectsAsContractor[0]?.contractorRoleProjects.length}</div>
                                <div className="stat-title">Contractor</div>
                                <div className="stat-title font-bold">{userStatsData.mostProjectsAsContractor[0]?.name}</div>
                                <div className='stat-desc'>({userStatsData.mostProjectsAsContractor[0]?.email})</div>
                                <div className="stat-desc text-secondary">Most projects as a contractor</div>
                            </div>
                        }


                        {
                            userStatsIsLoading &&
                            <div className="stat">
                                <div className="stat-figure text-secondary">
                                    <div className="avatar ">
                                        <div className="w-16 rounded-full">
                                            <img src="/avatar.png" />
                                        </div>
                                    </div>
                                </div>
                                <div className="stat-value">
                                    <span className="loading loading-ring loading-sm"></span>
                                </div>
                                <div className="stat-title">Site Manager</div>
                                <div className="stat-desc text-secondary">Most projects as a site manager</div>
                            </div>
                        }

                        {
                            userStatsData &&
                            <div className="stat">
                                <div className="stat-figure text-secondary">
                                    {
                                        userStatsData.mostProjectsAsSiteManager[0]?.image ?
                                            <div className="avatar">
                                                <div className="w-14 rounded-full">
                                                    <img src={userStatsData.mostProjectsAsSiteManager[0].image} />
                                                </div>
                                            </div>
                                            :
                                            <div className="avatar placeholder">
                                                <div className="bg-neutral-focus text-neutral-content rounded-full w-14 pb-2">
                                                    <span className="text-3xl font-medium">{userStatsData.mostProjectsAsSiteManager[0]?.name ? userStatsData.mostProjectsAsSiteManager[0]?.name?.charAt(0) : userStatsData.mostProjectsAsSiteManager[0]?.email?.charAt(0)}</span>
                                                </div>
                                            </div>
                                    }
                                </div>
                                <div className="stat-value">{userStatsData.mostProjectsAsSiteManager[0]?.managerRoleProjects.length}</div>
                                <div className="stat-title">Site Manager</div>
                                <div className="stat-title font-bold">{userStatsData.mostProjectsAsSiteManager[0]?.name}</div>
                                <div className='stat-desc'>({userStatsData.mostProjectsAsSiteManager[0]?.email})</div>
                                <div className="stat-desc text-secondary">Most projects as a site manager</div>
                            </div>
                        }


                    </div>
                </div>
            </section>



        </main >
    );
}