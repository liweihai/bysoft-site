import {getModel, findModels} from "@/lib/data"
import {Endpoint, Quota} from "@/lib/definitions"
import EditForm from '@/components/endpoint/EditForm';
import { Suspense } from 'react'
import {auth} from '@/auth';

async function ClonePage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params
    const slug = params.slug
    
    const session = await auth()

    const oldEndpoint = await getModel<Endpoint>("Endpoint", slug)
    const obj = {
        customer_id: session.user.id,
        provider: oldEndpoint.provider, 
        site_url: oldEndpoint.site_url, 
        base_url: oldEndpoint.base_url,
        rpm_threshold: oldEndpoint.rpm_threshold,
        rpd_threshold: oldEndpoint.rpd_threshold,
        tpm_threshold: oldEndpoint.tpm_threshold,
        tpd_threshold: oldEndpoint.tpd_threshold,
        free_tokens: oldEndpoint.free_tokens,
        modals: oldEndpoint.modals,
        in_modals: oldEndpoint.in_modals,
        context_window: oldEndpoint.context_window,
    }

    return (
        <div className="mx-auto p-4">
            <Suspense>
                <EditForm obj={obj as Endpoint} />
            </Suspense>
        </div>
    )
}

export default ClonePage