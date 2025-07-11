import {countModels, findModels} from "@/lib/data"
import {Config, Blog} from "@/lib/definitions"
import EditForm from '@/components/blog/EditForm';
import { Suspense } from 'react'

async function CreatePage() {
    const categoryConfigs = await findModels<Config>("Config", {name: 'categories'}, {limit: 1, offset: 0})
    const tagConfigs = await findModels<Config>("Config", {name: 'tags'}, {limit: 1, offset: 0})

    return (
        <div className="mx-auto p-4">
            <Suspense>
                <EditForm obj={{} as Blog} categories={categoryConfigs[0].value.split(",")} tags={tagConfigs[0].value.split(",")} />
            </Suspense>
        </div>
    )
}

export default CreatePage