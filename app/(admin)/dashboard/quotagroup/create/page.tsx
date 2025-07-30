import {countModels, findModels} from "@/lib/data"
import {QuotaGroup} from "@/lib/definitions"
import EditForm from '@/components/quotagroup/EditForm';
import { Suspense } from 'react'
import { auth } from '@/auth';
import Algorithms from "@/data/algorithm"

async function CreatePage() {
    const session = await auth()

    return (
        <div className="mx-auto p-4">
            <Suspense>
                <EditForm obj={{customer_id: session.user.id} as QuotaGroup} algorithms={Algorithms} />
            </Suspense>
        </div>
    )
}

export default CreatePage