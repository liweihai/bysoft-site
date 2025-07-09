import {countModels, findModels} from "@/lib/data"
import {Endpoint} from "@/lib/definitions"
import EditForm from '@/components/endpoint/EditForm';
import { Suspense } from 'react'

async function CreatePage() {
    return (
        <div className="mx-auto p-4">
            <Suspense>
                <EditForm obj={{} as Endpoint} />
            </Suspense>
        </div>
    )
}

export default CreatePage