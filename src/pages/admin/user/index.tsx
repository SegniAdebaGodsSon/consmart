import { useState } from "react";
import { RiArrowGoBackFill } from 'react-icons/ri';
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import UserSearchComponent, { SearchObject } from "~/components/admin/project/userSearchComponent";
import Alert from "~/components/common/Alert";

interface GetAllInput {
    page: number,
    limit: number,
    search: string,
    orderBy: 'latest' | 'alphabet',
}

export default function Page() {
    const [getAllInput, setGetAllInput] = useState<GetAllInput>({
        page: 1,
        limit: 25,
        search: '',
        orderBy: 'latest',
    })


    const { data, isLoading, error, refetch } = api.user.getAllAdmin.useQuery(getAllInput);
    const { data: updateUserRoleData, isLoading: updateUserRoleIsLoading, mutate: updateUserRoleMutate, error: updateUserRoleError, isSuccess: updateUserRoleIsSuccess } = api.user.updateUserRole.useMutation();
    const { data: updateUserStatusData, isLoading: updateUserStatusIsLoading, mutate: updateUserStatusMutate, error: updateUserStatusError, isSuccess: updateUserStatusIsSuccess } = api.user.updateUserStatus.useMutation();

    const router = useRouter();

    const handleSubmit = (searchObject: SearchObject) => {
        setGetAllInput((prevState: GetAllInput) => ({
            ...searchObject,
            page: prevState.page,
            limit: prevState.limit,
        } as GetAllInput));
        refetch();
    }

    const banClickHandler = (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
        e.preventDefault();
        if (!data) return;
        const user = data.users[index];
        if (!user) return;

        const ban = confirm(`Are sure you want to ban the user ${user?.name}(${user?.email})?`);
        if (ban) {
            updateUserStatusMutate({ id: user.id, status: 'BANNED' });
        }
        setTimeout(() => {
            if (updateUserStatusIsSuccess) refetch();

        }, 1500);
    }

    const unbanClickHandler = (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
        e.preventDefault();
        if (!data) return;
        const user = data.users[index];
        if (!user) return;

        const ban = confirm(`Are sure you want to unban the user ${user?.name}(${user?.email})?`);
        if (ban) {
            updateUserStatusMutate({ id: user.id, status: 'NORMAL' });
        }
        setTimeout(() => {
            if (updateUserStatusIsSuccess) refetch();
        }, 1500);
    }

    const makeAdminClickHandler = (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
        e.preventDefault();
        if (!data) return;
        const user = data.users[index];
        if (!user) return;

        const makeAdmin = confirm(`Are sure you want to make the user ${user?.name}(${user?.email}) an Admin?`);
        if (makeAdmin) {
            updateUserRoleMutate({ id: user.id, role: 'ADMIN' });
        }
        setTimeout(() => {
            if (updateUserRoleIsSuccess) refetch();
        }, 1500);
    }

    return (
        <main className="container my-16">

            {
                updateUserRoleIsSuccess &&
                <Alert type="success" duration={1500} message="User successfully changed to an Admin" />
            }

            {
                updateUserRoleError &&
                <Alert type="error" duration={1500} message={updateUserRoleError.message} />
            }

            {
                updateUserStatusIsSuccess &&
                <Alert type="success" duration={1500} message="User status successfully changed" />
            }

            {
                updateUserStatusError &&
                <Alert type="error" duration={1500} message={updateUserStatusError.message} />
            }

            <section>
                <button className="btn btn-neutral" onClick={() => router.back()}>
                    <RiArrowGoBackFill />
                </button>
                <div className="my-3">
                    <p className="text-3xl font-semibold">
                        User Management
                    </p>
                </div>
            </section>
            <section className="flex justify-center">
                <UserSearchComponent cb={handleSubmit} />
            </section>

            <section>
                {
                    isLoading &&
                    <div className="h-screen flex justify-center items-center">
                        <span className="loading loading-bars loading-lg"></span>
                    </div>
                }

                {
                    data &&
                    <div>
                        <div>
                            <p>Total results: {data.total}</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="table">
                                {/* head */}
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>User</th>
                                        <th>Consultant Roles</th>
                                        <th>Contractor Roles</th>
                                        <th>Site Manager Roles</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* row */}
                                    {
                                        data.users.map((user, index) => (
                                            <tr key={user.id}>
                                                <td>{index + 1}</td>
                                                <td>
                                                    <div className="flex items-center space-x-3">
                                                        {
                                                            user.image ?
                                                                <div className="avatar">
                                                                    <div className="w-14 rounded-full">
                                                                        <img src={user.image} />
                                                                    </div>
                                                                </div>
                                                                :
                                                                <div className="avatar placeholder">
                                                                    <div className="bg-neutral-focus text-neutral-content rounded-full w-14 pb-2">
                                                                        <span className="text-3xl font-medium">{user.name ? user.name?.charAt(0) : user.email?.charAt(0)}</span>
                                                                    </div> </div>
                                                        }
                                                        <div>
                                                            <div className="font-bold">{user.name}</div>
                                                            <div className="text-sm opacity-50">{user.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    {user._count.consultantRoleProjects}
                                                </td>
                                                <td>{user._count.contractorRoleProjects}</td>
                                                <td>{user._count.managerRoleProjects}</td>
                                                <th>
                                                    {
                                                        user.status === "NORMAL" ?
                                                            <button className="btn btn-outline btn-error" disabled={updateUserStatusIsLoading} onClick={(e: React.MouseEvent<HTMLButtonElement>) => banClickHandler(e, index)}>
                                                                Ban
                                                                {
                                                                    updateUserStatusIsLoading &&
                                                                    <span className="loading loading-ring loading-md"></span>
                                                                }
                                                            </button>
                                                            :
                                                            <button className="btn btn-outline btn-success" disabled={updateUserStatusIsLoading} onClick={(e: React.MouseEvent<HTMLButtonElement>) => unbanClickHandler(e, index)}>
                                                                Unban
                                                                {
                                                                    updateUserStatusIsLoading &&
                                                                    <span className="loading loading-ring loading-md"></span>
                                                                }
                                                            </button>
                                                    }
                                                </th>
                                                <th>
                                                    <button className="btn btn-outline btn-info" disabled={updateUserRoleIsLoading} onClick={(e: React.MouseEvent<HTMLButtonElement>) => makeAdminClickHandler(e, index)}>
                                                        Make Admin
                                                        {
                                                            updateUserRoleIsLoading &&
                                                            <span className="loading loading-ring loading-md"></span>
                                                        }
                                                    </button>
                                                </th>
                                            </tr>

                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                }
            </section>
        </main>
    );
}