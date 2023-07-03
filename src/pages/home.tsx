import { api } from "~/utils/api";

export default function UserHome() {

    const { data: consultantRoleProjects, isLoading: consultantRoleProjectsIsLoading, error: consultantRoleProjectsError } = api.project.getAllWhereRoleIsConsultant.useQuery({
        page: 1,
        limit: 5,
        orderBy: 'latest',
        status: 'ACCEPTED'
    });

    const { data: contractorRoleProjects, isLoading: contractorRoleProjectsIsLoading, error: contractorRoleProjectsError } = api.project.getAllWhereRoleIsContractor.useQuery({
        page: 1,
        limit: 5,
        orderBy: 'latest',
        status: 'ACCEPTED'
    });

    const { data: siteManagerRoleProjects, isLoading: siteManagerRoleProjectsIsLoading, error: siteManagerRoleProjectsError } = api.project.getAllWhereRoleIsSiteManager.useQuery({
        page: 1,
        limit: 5,
        orderBy: 'latest',
        status: 'ACCEPTED'
    });

    return (
        <main>
            <section>
                <h1></h1>
            </section>
            <section>

            </section>
            <section>

            </section>
        </main>
    );
}