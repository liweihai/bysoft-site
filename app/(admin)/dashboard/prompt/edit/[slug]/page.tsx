import {getModel, findModels} from "@/lib/data"
import {Config, Prompt} from "@/lib/definitions"
import EditForm from '@/components/prompt/EditForm';
import { Suspense } from 'react'
import {auth} from '@/auth';

async function EditPage(props: { params: Promise<{ slug: string }> }) {
    const tagConfigs = await findModels<Config>("Config", {name: 'tags'}, {limit: 1, offset: 0})
    
    const params = await props.params
    const slug = params.slug

    const prompt = await getModel<Prompt>("Article", slug)

    const session = await auth()

    prompt.customer_id = prompt.customer_id || session.user.id
    prompt.state = 0

    return (
        <div className="mx-auto p-4">
            <Suspense>
                <EditForm obj={prompt} tags={tagConfigs[0].value.split(",")} />
            </Suspense>
        </div>
    )
}

export default EditPage