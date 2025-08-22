import {Config} from "@/lib/definitions"
import {getModel, updateModel} from "@/lib/data"
import EditForm from '@/components/config/EditForm';
import { Suspense } from 'react'

async function EditPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params
    const id = params.id

    const config = await getModel<Config>("Config", id)

    return (
        <div className="mx-auto p-4">
            <Suspense>
                <EditForm obj={config} />
            </Suspense>
        </div>
    )
}

export default EditPage