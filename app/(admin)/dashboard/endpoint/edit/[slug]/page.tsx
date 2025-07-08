import {getModel, findModels} from "@/lib/data"
import {Endpoint} from "@/lib/definitions"
import EditForm from '@/components/endpoint/EditForm';
import { Suspense } from 'react'

async function EditPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params
    const slug = params.slug

    const endpoint = await getModel<Endpoint>("Endpoint", slug)

    return (
        <div className="mx-auto p-4">
            <Suspense>
                <EditForm obj={endpoint} />
            </Suspense>
        </div>
    )
}

export default EditPage