import { useParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { api } from '~/utils/api';

export default function Page() {
    // const projectId = params.id;
    const router = useRouter();

    // const { data: project, isLoading, error } = api.project.getOne.useQuery({
    //     id: projectId || ""
    // });

    return (
        <main>
            Project
        </main>
    );
}