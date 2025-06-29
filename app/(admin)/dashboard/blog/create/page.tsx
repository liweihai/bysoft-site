import {Blog} from "@/lib/definitions"
import EditForm from '@/components/blog/EditForm';
import { Suspense } from 'react'

async function CreatePage() {
    return (
        <div className="mx-auto p-4">
            <Suspense>
                <EditForm id={null} title={""} content={""} />
            </Suspense>
        </div>
    )
}

export default CreatePage