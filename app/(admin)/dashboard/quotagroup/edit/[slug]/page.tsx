import {getModel, findModels} from "@/lib/data"
import {QuotaGroup} from "@/lib/definitions"
import EditForm from '@/components/quotagroup/EditForm';
import { Suspense } from 'react'
import Algorithms from "@/data/algorithm"

async function EditPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params
    const slug = params.slug

    const quotaGroup = await getModel<QuotaGroup>("QuotaGroup", slug)

    return (
        <div className="mx-auto p-4">
            <Suspense>
                <EditForm obj={quotaGroup} algorithms={Algorithms} />
            </Suspense>
        </div>
    )
}

export default EditPage