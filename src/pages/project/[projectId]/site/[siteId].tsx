import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { RiArrowGoBackFill } from 'react-icons/ri';
import { MdDriveFileRenameOutline, MdOutlineLocationOn } from 'react-icons/md';
import { FaTasks, FaRegBuilding } from 'react-icons/fa';
import { FiUser, FiCalendar } from 'react-icons/fi'
import { useRef, useState } from "react";
import Alert from "~/components/common/Alert";
import { AiOutlineClose } from 'react-icons/ai';

export default function Page() {
    const { data: session } = useSession();
    const [showAddTaskModal, setShowAddTaskModal] = useState<boolean>(false);
    const [showUpdateTaskProgress, setShowUpdateTaskProgress] = useState<boolean>(false);
    const router = useRouter();
    const siteId = router.query.siteId as string;

    const taskNameRef = useRef<HTMLInputElement | null>(null);
    const taskProgressRef = useRef<HTMLInputElement | null>(null);
    const taskDetailRef = useRef<HTMLTextAreaElement | null>(null);
    const updatedProgressRef = useRef<HTMLInputElement | null>(null);

    const { data: siteData, isLoading: siteIsLoading, error: siteError, refetch: siteRefetch } = api.site.getOne.useQuery({
        id: siteId || ""
    });

    const { mutate: taskMutate, isLoading: taskMutateIsLoading, error: taskMutateError, isSuccess: taskMutateIsSuccess, data: taskMutateData } = api.task.create.useMutation();
    const { mutate: taskProgressMutate, isLoading: taskProgressIsLoading, error: taskProgressError, isSuccess: taskProgressIsSuccess, data: taskProgressData } = api.task.updateProgress.useMutation();

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

    function handleUpdateProgress(e: React.MouseEvent<HTMLButtonElement>, taskId: string) {
        e.preventDefault();
        const updatedProgress = updatedProgressRef.current?.value || '';
        taskProgressMutate({ id: taskId, progress: parseFloat(updatedProgress) });
    }

    if (taskMutateIsSuccess && taskMutateData) {
        siteData?.tasks.push(taskMutateData);
    }

    return (
        <>
            <header>
                <title>Site {siteData ? `- ${siteData.name}` : ``}</title>
            </header>
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
                    taskProgressIsSuccess &&
                    <Alert duration={1500} message="Task progress successfully updated!" type="success" />
                }
                {
                    taskProgressError &&
                    <Alert duration={1500} message="Task progress update error!" type="error" />
                }

                {
                    siteData &&
                    <section className='max-w-4xl shadow-xl mx-auto p-6 rounded-xl  transition-all duration-200 my-10 ease-linear'>
                        <p className='text-3xl text-center my-6 font-bold'>Site Info</p>

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
                    <section className='max-w-4xl shadow-xl mx-auto p-6 my-10 '>
                        <p className='text-3xl text-center my-4 font-semibold'>Tasks</p>

                        {
                            siteData.tasks.length === 0 &&
                            <p className="text-center text-warning">No Tasks!</p>
                        }

                        {/* tasks here */}
                        <div className="flex flex-wrap py-4">
                            {
                                siteData.tasks.map((task, index) => {
                                    const progress = taskProgressData ? taskProgressData.progress : task.progress;
                                    return (
                                        <div className="shadow-md p-5 flex gap-2 flex-col hover:shadow-xl transition-all duration-200  ease-linear">
                                            <p><span className="font-bold">Name:</span> {task.name}</p>
                                            <p><span className="font-bold">Detail:</span> {task.detail}</p>
                                            <div>
                                                <p><span className="font-bold">Progress:</span> {progress}%</p>
                                                {
                                                    progress <= 40 &&
                                                    <progress className="progress progress-error w-56" value={progress} max="100"></progress>
                                                }

                                                {
                                                    progress > 40 && progress <= 70 &&
                                                    <progress className="progress progress-warning w-56" value={progress} max="100"></progress>
                                                }

                                                {
                                                    progress > 70 &&
                                                    <progress className="progress progress-success w-56" value={progress} max="100"></progress>
                                                }
                                            </div>
                                            <p><span className="font-bold">Created at:</span> {task.createdAt.toDateString()}</p>
                                            {
                                                showUpdateTaskProgress ?
                                                    <div className="mt-3">
                                                        <form className="p-5 shadow-md ">
                                                            <div className="flex justify-end">
                                                                <button className="hover:text-error transition-all duration-150 ease-linear" onClick={() => setShowUpdateTaskProgress(false)}>
                                                                    <AiOutlineClose />
                                                                </button>
                                                            </div>
                                                            <h1 className="text-center font-semibold text-lg">Update Progress</h1>
                                                            <div className="flex items-center gap-6 mt-4">
                                                                <div className="form-control w-40 max-w-xs">
                                                                    <input ref={updatedProgressRef} type="number" placeholder="Enter progress..." className="input input-bordered w-full max-w-xs" />
                                                                    {
                                                                        taskProgressError &&
                                                                        <label className="label">
                                                                            <span className="label-text-alt text-sm text-error">{taskProgressError.data?.zodError?.fieldErrors.progress}</span>
                                                                        </label>
                                                                    }
                                                                </div>
                                                                <button className="btn btn-success" disabled={taskProgressIsLoading} onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleUpdateProgress(e, task.id)}>
                                                                    {
                                                                        taskProgressIsLoading ?
                                                                            <>
                                                                                Updating
                                                                                <span className="loading loading-ring loading-sm"></span>
                                                                            </>
                                                                            :
                                                                            <>
                                                                                Update
                                                                            </>
                                                                    }
                                                                </button>
                                                            </div>
                                                        </form>
                                                    </div>
                                                    :
                                                    <button className="btn btn-outline btn-warning btn-sm" disabled={taskProgressIsLoading} onClick={() => setShowUpdateTaskProgress(true)}>
                                                        {
                                                            taskProgressIsLoading ?
                                                                <>
                                                                    Editing Progress
                                                                    <span className="loading loading-ring loading-sm"></span>
                                                                </>
                                                                :
                                                                <>
                                                                    Edit progress
                                                                </>
                                                        }
                                                    </button>
                                            }

                                        </div>
                                    )
                                })
                            }
                        </div>

                        {/* add task */}
                        <div className="flex justify-end">
                            {
                                taskMutateIsLoading ?
                                    <button className="btn btn-success" disabled onClick={() => setShowAddTaskModal(true)}>
                                        adding task
                                        <span className="loading loading-ring loading-md"></span>
                                    </button>
                                    :
                                    <button className="btn btn-success" onClick={() => setShowAddTaskModal(true)}>add task</button>
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
                    showAddTaskModal &&
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
        </>
    );
}