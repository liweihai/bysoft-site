import {countModels, findModels} from "@/lib/data"
import { Prompt} from "@/lib/definitions"
import EditForm from '@/components/prompt/EditForm';
import { Suspense } from 'react'
import {auth} from '@/auth';

async function CreatePage() {
    const session = await auth()

    return (
        <div className="mx-auto p-4">
            <Suspense>
                <EditForm obj={{customer_id: session.user.id} as Prompt} />
            </Suspense>
        </div>
    )
}

export default CreatePage