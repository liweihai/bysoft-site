import {getModel, findModels} from "@/lib/data"
import {Config, Blog} from "@/lib/definitions"
import EditForm from '@/components/blog/EditForm';
import { Suspense } from 'react'

async function EditPage(props: { params: Promise<{ slug: string }> }) {
    const tagConfigs = await findModels<Config>("Config", {name: 'tags'}, {limit: 1, offset: 0})
    
    const params = await props.params
    const slug = params.slug

    const blog = await getModel<Blog>("Article", slug)

    return (
        <div className="mx-auto p-4">
            <Suspense>
                <EditForm obj={blog} tags={tagConfigs[0].value.split(",")} />
            </Suspense>
        </div>
    )
}

export default EditPage