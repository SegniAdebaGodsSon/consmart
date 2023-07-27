import { ProjectType } from "@prisma/client";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import { DateValueType } from "react-tailwindcss-datepicker/dist/types";
import Alert from "~/components/common/Alert";
import SearchUsers from "~/components/common/searchUsers";
import { api } from "~/utils/api";
import { RiArrowGoBackFill } from 'react-icons/ri';

export default function Create() {
    const [dateRange, setDateRange] = useState<DateValueType>(null);
    const ownerIdRef = useRef<string>();
    const contractorIdRef = useRef<string>();
    const nameRef = useRef<HTMLInputElement | null>(null);
    const descriptionRef = useRef<HTMLTextAreaElement | null>(null);
    const typeRef = useRef<HTMLSelectElement | null>(null);

    const router = useRouter();

    const { mutate, data, isLoading, error, isSuccess } = api.project.create.useMutation()

    const handleDateRangeChange = (value: DateValueType, e?: HTMLInputElement | null | undefined) => {
        setDateRange(value)
    }

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const data = {
            name: nameRef.current?.value || "",
            description: descriptionRef.current?.value || "",
            type: typeRef.current?.value as ProjectType,
            contractorId: contractorIdRef.current || "",
            ownerId: ownerIdRef.current || "",
            startDate: dateRange && dateRange.startDate ? new Date(dateRange.startDate.toString()) : undefined,
            endDate: dateRange && dateRange.endDate ? new Date(dateRange.endDate.toString()) : undefined
        }

        mutate(data as any);
    }

    setTimeout(() => {
        if (isSuccess) router.push('/project');
    }, 1000)

    return (
        <main className="">

            {
                isSuccess && <Alert duration={3000} message="Project successfully created! (pending approval)" type="success" />
            }
            {
                error && <Alert duration={3000} message="Error creating a project!" type="error" />
            }

            <header className="flex items-center mt-4 gap-4">
                <button className="btn btn-neutral" onClick={() => router.back()}>
                    <RiArrowGoBackFill />
                </button>
            </header>

            <section className="flex w-full items-center justify-center flex-col my-4">
                <h1 className="text-2xl font-bold">Create new project</h1>
                <form className="flex flex-col gap-5 w-96 shadow-2xl p-8">
                    <div className="form-control w-full max-w-xs">
                        <label className="label">
                            <span className="label-text">Name</span>
                        </label>
                        <input ref={nameRef} type="text" placeholder="" className="input input-bordered w-full max-w-xs" />
                        <label className="label">
                            <span className="label-text text-error text-xs">{error?.data?.zodError?.fieldErrors.name}</span>
                        </label>
                    </div>

                    <div className="form-control w-full max-w-xs">
                        <label className="label">
                            <span className="label-text">Description</span>
                        </label>
                        <textarea ref={descriptionRef} className="textarea textarea-bordered" placeholder=""></textarea>
                        <label className="label">
                            <span className="label-text text-error text-xs">{error?.data?.zodError?.fieldErrors.description}</span>
                        </label>
                    </div>

                    <div className="form-control w-full max-w-xs">
                        <label className="label">
                            <span className="label-text">Type</span>
                        </label>
                        <select ref={typeRef} className="select select-bordered w-full max-w-xs">
                            <option value={ProjectType.COMMERTIAL_CONSTRUCTION}>Commercial construction</option>
                            <option value={ProjectType.HEAVY_CONSTRUCTION}>Heavy construction</option>
                            <option value={ProjectType.INDUSTRIAL_CONSTRUCTION}>Industrial construction</option>
                            <option value={ProjectType.RESIDENTIAL_CONSTRUCTION}>Residential construction</option>
                        </select>
                        <label className="label">
                            <span className="label-text text-error text-xs">{error?.data?.zodError?.fieldErrors.type}</span>
                        </label>
                    </div>

                    <div className="form-control w-full max-w-xs">
                        <label className="label">
                            <span className="label-text">Select owner</span>
                        </label>
                        <SearchUsers placeholder="search by email or username" userIdRef={ownerIdRef} />

                        <label className="label">
                            <span className="label-text text-error text-xs">{error?.data?.zodError?.fieldErrors.contractorId}</span>
                        </label>
                    </div>

                    <div className="form-control w-full max-w-xs">
                        <label className="label">
                            <span className="label-text">Select contractor</span>
                        </label>
                        <SearchUsers placeholder="search by email or username" userIdRef={contractorIdRef} />

                        <label className="label">
                            <span className="label-text text-error text-xs">{error?.data?.zodError?.fieldErrors.contractorId}</span>
                        </label>
                    </div>
                    <div className="form-control w-full max-w-xs">
                        <label className="label">
                            <span className="label-text">Select start and end date</span>
                        </label>
                        <Datepicker
                            placeholder="Pick start date and end date"
                            value={dateRange || null}
                            onChange={handleDateRangeChange}
                            showFooter
                        />
                        <label className="label">
                            <span className="label-text text-error text-xs">{error?.data?.zodError?.fieldErrors.startDate ? "Start date: " + error?.data?.zodError?.fieldErrors.startDate : ""}</span>
                        </label>

                        <label className="label">
                            <span className="label-text text-error text-xs">{error?.data?.zodError?.fieldErrors.endDate ? "End date: " + error?.data?.zodError?.fieldErrors.endDate : ""}</span>
                        </label>

                    </div>

                    <div className="form-control w-max">
                        <button className="btn btn-outline btn-primary" disabled={isLoading ? true : false} onClick={handleSubmit}>
                            {isLoading ?
                                <>
                                    Creating{" "}
                                    <span className="loading loading-ring loading-md"></span>
                                </>
                                :
                                <>
                                    Create{" "}
                                </>
                            }
                        </button>
                    </div>


                </form>
            </section>
        </main >
    );
}