import { RouterOutputs, api } from "~/utils/api";
import { BsFillCalendarRangeFill } from 'react-icons/bs';
import Alert from "~/components/common/Alert";
type ProjectType = RouterOutputs['project']['getAllAdmin']['projects'][number];

export default function ProjectCard(props: { project: ProjectType, refetch: () => any }) {
    const { project, refetch } = props;

    const { mutate, data, isLoading, error, isSuccess } = api.project.setStatusAdmin.useMutation();

    function rejectHandler(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        mutate({ id: project.id, action: 'reject' });
        refetch();
    }

    function acceptHandler(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        mutate({ id: project.id, action: 'accept' });
        refetch();
    }

    return (
        <main>
            {
                isSuccess && <Alert duration={3000} message="Project status successfully updated!" type="success" />
            }
            {
                error && <Alert duration={3000} message="Error updating the project status!" type="error" />
            }
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
                                    </div> </div>
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
                </div>

                <div className="flex gap-4">
                    <button className="btn btn-success" disabled={isLoading ? true : false} onClick={acceptHandler}>
                        {isLoading ?
                            <>
                                Approve{" "}
                                <span className="loading loading-ring loading-md"></span>
                            </>
                            :
                            <>
                                Approve{" "}
                            </>
                        }
                    </button>
                    <button className="btn btn-error" disabled={isLoading ? true : false} onClick={rejectHandler}>
                        {isLoading ?
                            <>
                                Reject{" "}
                                <span className="loading loading-ring loading-md"></span>
                            </>
                            :
                            <>
                                Reject{" "}
                            </>
                        }
                    </button>
                </div>
            </div>
        </main>
    );
}