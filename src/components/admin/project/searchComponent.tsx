import React, { useRef } from "react";

export interface SearchObject {
    search: string,
    orderBy: string,
}

export default function ProjectSearchComponent(props: { cb: (searchObject: SearchObject) => void }) {
    const { cb } = props;

    const searchRef = useRef<HTMLInputElement>(null);
    const statusRef = useRef<HTMLSelectElement>(null);
    const orderByRef = useRef<HTMLSelectElement>(null);
    const roleRef = useRef<HTMLSelectElement>(null);



    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        let status = undefined;

        if (statusRef.current) {
            status = statusRef.current.value === 'ALL' ? undefined : statusRef.current.value;
        }

        let searchObject: SearchObject = {
            search: searchRef.current ? searchRef.current.value : '',
            orderBy: orderByRef.current ? orderByRef.current.value : '',
        }
        cb(searchObject);
    }


    return (
        <div>
            <form className="">
                <div className="join flex flex-wrap">
                    <div>
                        <input ref={searchRef} className="input input-bordered join-item" placeholder="Search..." />
                    </div>
                    <div className="flex">
                        <label className="label">
                            <span className="label-text px-2">Sort by</span>
                        </label>
                        <select ref={orderByRef} className="select select-bordered join-item">
                            <option value={"latest"}>Latest</option>
                            <option value={"urgent"}>Urgent</option>
                        </select>
                    </div>

                    <div className="indicator">
                        <button className="btn join-item" onClick={handleSubmit}>Search</button>
                    </div>
                </div>
            </form>
        </div>
    );
}