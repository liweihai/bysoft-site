import {getModel, findModels} from "@/lib/data"
import {Endpoint} from "@/lib/definitions"
import EditForm from '@/components/endpoint/EditForm';
import { Suspense } from 'react'
import {auth} from '@/auth';

async function EditPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params
    const slug = params.slug
    
    const session = await auth()

    const endpoint = await getModel<Endpoint>("Endpoint", slug)
    endpoint.customer_id = endpoint.customer_id || session.user.id

    return (
        <div className="mx-auto p-4">
            <Suspense>
                <EditForm obj={endpoint} />
            </Suspense>
        </div>
    )
}

export default EditPage