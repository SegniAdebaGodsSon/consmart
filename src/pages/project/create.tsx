import { ProjectType } from "@prisma/client";
import { useRef, useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import { DateValueType } from "react-tailwindcss-datepicker/dist/types";
import SearchUsers from "~/components/common/searchUsers";

export default function Create() {
    const [dateRange, setDateRange] = useState<DateValueType>();
    const contractorIdRef = useRef<string>();
    const nameRef = useRef<HTMLInputElement | null>(null);
    const descriptionRef = useRef<HTMLInputElement | null>(null);
    const typeRef = useRef<HTMLSelectElement | null>(null);


    const handleDateRangeChange = (value: DateValueType, e?: HTMLInputElement | null | undefined) => {
        setDateRange(value)
    }

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        const data = {
            name: nameRef.current?.value,
            description: descriptionRef.current?.value,
            type: typeRef.current?.value,
            contractorId: contractorIdRef.current,
            startDate: dateRange?.startDate,
            endDate: dateRange?.endDate
        }
    }

    return (
        <main className="h-screen">
            <header>
                <h1 className="text-4xl">Create new project</h1>
            </header>

            <section className="flex w-full items-center justify-center">
                <form className="flex flex-col gap-5 w-96 shadow-2xl p-8">
                    <div className="form-control w-full max-w-xs">
                        <label className="label">
                            <span className="label-text">Name</span>
                        </label>
                        <input ref={nameRef} type="text" placeholder="" className="input input-bordered w-full max-w-xs" />
                    </div>

                    <div className="form-control w-full max-w-xs">
                        <label className="label">
                            <span className="label-text">Description</span>
                        </label>
                        <input ref={descriptionRef} type="text" placeholder="" className="input input-bordered w-full max-w-xs" />
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
                    </div>

                    <div className="form-control w-full max-w-xs">
                        <label className="label">
                            <span className="label-text">Select contractor</span>
                        </label>
                        <SearchUsers placeholder="" contractorIdRef={contractorIdRef} />
                    </div>

                    <div className="form-control w-full max-w-xs">
                        <Datepicker
                            placeholder="Pick start date and end date"
                            value={dateRange || null}
                            onChange={handleDateRangeChange}
                            showFooter
                        />
                    </div>

                    <div className="form-control w-max">
                        <button className="btn btn-outline btn-primary" onClick={handleSubmit}>Create</button>
                    </div>

                </form>
            </section>
        </main >
    );
}