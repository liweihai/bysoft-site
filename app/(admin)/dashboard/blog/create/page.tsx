import {countModels, findModels} from "@/lib/data"
import {Config} from "@/lib/definitions"
import EditForm from '@/components/blog/EditForm';
import { Suspense } from 'react'

async function CreatePage() {
    const categoryConfigs = await findModels<Config>("Config", 1, 0, {name: 'categories'})
    const tagConfigs = await findModels<Config>("Config", 1, 0, {name: 'tags'})

    return (
        <div className="mx-auto p-4">
            <Suspense>
                <EditForm id={null} title={""} remark={""} content={""} category={""} keywords={[]} categories={categoryConfigs[0].value.split(",")} tags={tagConfigs[0].value.split(",")} />
            </Suspense>
        </div>
    )
}

export default CreatePage