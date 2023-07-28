import { RouterOutputs } from "~/utils/api";
import { BsFillCalendarRangeFill } from 'react-icons/bs';
import { useSession } from "next-auth/react";
import moment from "moment";
import Link from "next/link";
type ProjectType = RouterOutputs['project']['getAll']['projects'][number];

export default function ProjectCard(props: { project: ProjectType }) {
    const { project } = props;

    const { data: session } = useSession();
    const userId = session?.user.id;

    return (
        <div className="p-8 shadow-lg hover:shadow-2xl transition-all duration-200 ease-linear flex gap-4 flex-col">
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
            <div>
                <Link href={`/project/${project.id}`} className="btn btn-info">Details</Link>
            </div>
        </div>
    );
}