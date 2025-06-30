import {getModel, findModels} from "@/lib/data"
import {Config, Blog} from "@/lib/definitions"
import EditForm from '@/components/blog/EditForm';
import { Suspense } from 'react'

async function EditPage(props: { params: Promise<{ slug: string }> }) {
    const categoryConfigs = await findModels<Config>("Config", 1, 0, {name: 'categories'})
    const tagConfigs = await findModels<Config>("Config", 1, 0, {name: 'tags'})
    
    const params = await props.params
    const slug = params.slug

    const blog = await getModel<Blog>("Article", slug)

    return (
        <div className="mx-auto p-4">
            <Suspense>
                <EditForm id={blog.id} title={blog.title} remark={blog.remark} category={blog.category} keywords={blog.keywords.split(",")} content={blog.content} categories={categoryConfigs[0].value.split(",")} tags={tagConfigs[0].value.split(",")} />
            </Suspense>
        </div>
    )
}

export default EditPage