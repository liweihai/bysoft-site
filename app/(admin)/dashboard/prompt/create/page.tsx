import {countModels, findModels} from "@/lib/data"
import {Config, Prompt} from "@/lib/definitions"
import EditForm from '@/components/prompt/EditForm';
import { Suspense } from 'react'
import {auth} from '@/auth';

async function CreatePage() {
    const tagConfigs = await findModels<Config>("Config", {name: 'tags'}, {limit: 1, offset: 0})

    const session = await auth()

    return (
        <div className="mx-auto p-4">
            <Suspense>
                <EditForm obj={{customer_id: session.user.id} as Prompt} tags={tagConfigs[0].value.split(",")} />
            </Suspense>
        </div>
    )
}

export default CreatePage