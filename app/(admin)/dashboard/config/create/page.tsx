import {Config} from "@/lib/definitions"
import EditForm from '@/components/config/EditForm';
import { Suspense } from 'react'

async function CreatePage() {
    return (
        <div className="mx-auto p-4">
            <Suspense>
                <EditForm obj={{} as Config} />
            </Suspense>
        </div>
    )
}

export default CreatePage