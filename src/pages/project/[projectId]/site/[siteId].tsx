import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { RiArrowGoBackFill } from 'react-icons/ri';
import { MdDriveFileRenameOutline, MdOutlineLocationOn } from 'react-icons/md';
import { FaTasks, FaRegBuilding } from 'react-icons/fa';
import { FiUser, FiCalendar } from 'react-icons/fi'
import { useRef, useState } from "react";
import Alert from "~/components/common/Alert";

export default function Page() {
    const { data: session } = useSession();
    const [showModal, setShowModal] = useState<boolean>(false);
    const router = useRouter();
    const siteId = router.query.siteId as string;

    const taskNameRef = useRef<HTMLInputElement | null>(null);
    const taskProgressRef = useRef<HTMLInputElement | null>(null);
    const taskDetailRef = useRef<HTMLTextAreaElement | null>(null);

    const { data: siteData, isLoading: siteIsLoading, error: siteError, refetch: siteRefetch } = api.site.getOne.useQuery({
        id: siteId || ""
    });

    const { mutate: taskMutate, isLoading: taskMutateIsLoading, error: taskMutateError, isSuccess: taskMutateIsSuccess } = api.task.create.useMutation();

    function taskSubmitHandler(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        const data = {
            name: taskNameRef.current?.value || "",
            progress: taskProgressRef.current?.value || 0,
            detail: taskDetailRef.current?.value || "",
            siteId,
        }

        data.progress = parseInt(data.progress.toString())

        taskMutate(data as any);

    }

    if (taskMutateIsSuccess) {
        siteRefetch();
    }


    return (
        <main className="min-h-screen container">
            <header className="flex items-center mt-4 gap-4">
                <button className="btn btn-neutral" onClick={() => router.back()}>
                    <RiArrowGoBackFill />
                </button>
            </header>
            {
                siteIsLoading &&
                <section className='h-screen flex justify-center'>
                    <span className="loading loading-bars loading-lg"></span>
                </section>

            }
            {
                siteError &&
                <section className='h-screen flex justify-center items-center'>
                    <p className='text-error'>Error: {siteError.message}</p>
                </section>

            }

            {
                siteData &&
                <section className='max-w-4xl shadow-xl mx-auto p-6 rounded-3xl hover:shadow-md hover:rounded-none transition-all duration-200 my-10 ease-linear'>
                    <p className='text-3xl text-center my-4 font-semibold'>Site Info</p>

                    <div className="flex gap-5 justify-center flex-wrap">
                        <p className="flex gap-2 items-center"><MdDriveFileRenameOutline size={24} className="text-primary" /><span className='font-bold'>Name:</span> {siteData.name}</p>
                        <p className="flex gap-2 items-center"><MdOutlineLocationOn size={24} className="text-primary" /><span className='font-bold'>Location:</span> {siteData.location}</p>
                        <p className="flex gap-2 items-center"><FaTasks size={24} className="text-primary" /><span className='font-bold'>Tasks:</span> {siteData.tasks.length}</p>
                    </div>

                    <div className="flex gap-5 justify-center mt-5 flex-wrap">
                        <p className="flex gap-2 items-center"><FiUser size={24} className="text-primary" /><span className='font-bold'>Manager:</span> {siteData.manager.name === '' ? siteData.manager.email : siteData.manager.name}</p>
                        <p className="flex gap-2 items-center"><FaRegBuilding size={24} className="text-primary" /><span className='font-bold'>Project:</span> {siteData.project.name}</p>
                    </div>

                    <p className="flex gap-2 items-center justify-center mt-5"><FiCalendar size={24} className="text-primary" /><span className='font-bold'>Created:</span> {siteData.createdAt.toDateString()}</p>

                </section>
            }

            <div className="divider"></div>

            {
                siteData &&
                <section className='max-w-4xl shadow-xl mx-auto p-6  hover:shadow-md hover:rounded-none transition-all duration-200 my-10 ease-linear'>
                    <p className='text-3xl text-center my-4 font-semibold'>Tasks</p>

                    {
                        siteData.tasks.length === 0 &&
                        <p className="text-center text-warning">No Tasks!</p>
                    }

                    {/* tasks here */}
                    <div>
                    </div>

                    {/* add task */}
                    <div className="flex justify-end">
                        {
                            taskMutateIsLoading ?
                                <button className="btn btn-success" disabled onClick={() => setShowModal(true)}>
                                    adding task
                                    <span className="loading loading-ring loading-md"></span>
                                </button>
                                :
                                <button className="btn btn-success" onClick={() => setShowModal(true)}>add task</button>
                        }
                    </div>

                </section>
            }

            {
                taskMutateError &&
                <Alert duration={2000} type="error" message={`Error creating task: ${taskMutateError.message}`} />
            }

            {/* add task modal*/}
            {
                showModal &&
                <div className="absolute h-screen bg-neutral/20">
                    <div className="relative">
                        <form className="">
                            <h3 className="font-bold text-lg">New Task</h3>

                            <div className="form-control w-full max-w-xs">
                                <label className="label">
                                    <span className="label-text">Name</span>
                                </label>
                                <input type="text" placeholder="" className="input input-bordered w-full max-w-xs" ref={taskNameRef} />
                                <label className="label">
                                    <span className="label-text text-error text-xs">{taskMutateError?.data?.zodError?.fieldErrors.name}</span>
                                </label>
                            </div>

                            <div className="form-control w-full max-w-xs">
                                <label className="label">
                                    <span className="label-text">Progress</span>
                                </label>
                                <input type="text" placeholder="" className="input input-bordered w-full max-w-xs" defaultValue={0} ref={taskProgressRef} />
                                <label className="label">
                                    <span className="label-text text-error text-xs">{taskMutateError?.data?.zodError?.fieldErrors.progress}</span>
                                </label>
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Detail</span>
                                </label>
                                <textarea className="textarea textarea-bordered h-24" placeholder="" ref={taskDetailRef}></textarea>
                                <label className="label">
                                    <span className="label-text text-error text-xs">{taskMutateError?.data?.zodError?.fieldErrors.detail}</span>
                                </label>
                            </div>

                            <div className="flex justify-end gap-5 items-center my-5">
                                {
                                    taskMutateIsLoading ?
                                        <button className="btn btn-outline btn-success" disabled onClick={taskSubmitHandler}>Submitting</button>
                                        :
                                        <button className="btn btn-outline btn-success" onClick={taskSubmitHandler}>Submit</button>
                                }

                                <button className="btn">Close</button>
                            </div>
                        </form>
                    </div>
                </div>
            }


        </main>
    );
}