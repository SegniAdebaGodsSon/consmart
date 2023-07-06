import { useSession } from "next-auth/react";
import { MutableRefObject, useRef, useState } from "react";
import { RouterOutputs, api } from "~/utils/api";

type UserType = RouterOutputs["user"]["searchUser"][number];

export default function SearchUsers(props: { placeholder: string, contractorIdRef: MutableRefObject<string | undefined> }) {
    const { placeholder, contractorIdRef } = props;
    const session = useSession();
    const [showUsers, setShowUsers] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);

    let { data: usersData, refetch: refetchUsers, isLoading } = api.user.searchUser.useQuery({
        nameOrEmail: inputRef.current ? inputRef.current.value.trim() : ""
    })

    const users = usersData as UserType[]

    const handleUserClick = (user: UserType) => {
        if (inputRef.current) {
            if (user.name) {
                inputRef.current.value = user.name;
            } else {
                if (user.email) {
                    inputRef.current.value = user.email;
                }
            }
        }
        contractorIdRef.current = user.id;
        setShowUsers(false);
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const searchValue = event.target.value.trim();
        if (searchValue !== "" && !showUsers) {
            setShowUsers(true);
        }
        if (searchValue === "" && showUsers) {
            setShowUsers(false);
        }
        if (searchValue !== "") {
            refetchUsers();
        }
    };

    const handleInputFocus = () => {
        const searchValue = inputRef.current ? inputRef.current.value.trim() : "";
        if (searchValue !== "") {
            setShowUsers(true);
        }
    };

    const handleInputBlur = () => {
        setTimeout(() => {
            setShowUsers(false);
        }, 200);
    };

    const handleInputSubmit = (event: React.KeyboardEvent<HTMLInputElement>) => {
        const key = event.key;
        if (key === "Enter") {
            refetchUsers();
        }
    };

    return (
        <>
            <input ref={inputRef} type="text" placeholder={placeholder} className="input input-bordered" onFocus={handleInputFocus} onChange={handleInputChange} onKeyDown={handleInputSubmit} onBlur={handleInputBlur} />
            {
                showUsers &&
                <UsersContainer users={users} isLoading={isLoading} handleUserClick={handleUserClick} />
            }
        </>
    );
}

function UsersContainer(props: { users: UserType[], isLoading: boolean, handleUserClick: (user: UserType) => void }) {
    const { users, isLoading, handleUserClick } = props;

    if (isLoading) {
        return <div className="flex items-center justify-center shadow-2xl rounded-lg mt-4 p-4">
            <span className="loading loading-ring loading-lg"></span>
        </div>
    }

    if (!users) {
        return <div className="flex items-center justify-center shadow-2xl rounded-lg mt-4 p-4">
            <p className="text-error">Error loading users</p>
        </div>
    }

    if (users.length === 0) {
        return <div className="flex items-center justify-center shadow-2xl rounded-lg mt-4 p-4">
            <p className="text-neutral-content">No users found</p>
        </div>
    }

    return <div className="p-4 flex flex-col gap-1 shadow-2xl rounded-lg mt-4 max-w-sm">
        {
            users.map(user => (
                <User key={user.id} user={user} handleUserClick={handleUserClick} />
            ))
        }
    </div>
}

function User(props: { user: UserType, handleUserClick: (user: UserType) => void }) {
    const { id, image, email, name } = props.user;
    const { handleUserClick } = props;

    let avatarText = "";

    if (email) {
        avatarText = email.charAt(0);
    }

    if (name) {
        avatarText = name.charAt(0);
    }

    return (
        <div className="flex gap-x-4 items-center p-4 cursor-pointer hover:bg-neutral-focus" onClick={() => handleUserClick(props.user)}>
            {
                !image ?
                    <div className="avatar placeholder">
                        <div className="bg-neutral-focus text-neutral-content rounded-full w-10">
                            <span className="text-xl pb-1">{avatarText}</span>
                        </div>
                    </div>
                    :
                    <div className="avatar">
                        <div className="w-10 rounded-full">
                            <img src={image} alt={name ? name : ""} />
                        </div>
                    </div>
            }
            <div className="flex flex-col gap-1">
                <p>
                    {name}
                </p>
                <p className="text-xs text-neutral-content">
                    {email ? `(${email})` : ''}
                </p>
            </div>
        </div>
    )
}