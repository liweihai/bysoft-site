import Link from 'next/link';

import {findModels, getModel, groupModels} from "@/lib/data"
import {QuotaGroup, Quota, Endpoint, Customer} from "@/lib/definitions"
import { auth } from '@/auth';
import DelForm from '@/components/DelForm';
import EditForm from '@/components/quota/EditForm';
import EditPriorityForm from '@/components/quota/EditPriorityForm';
import CopyButton from '@/components/CopyButton';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default async function QuotaGroupViewPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params
    const slug = params.slug

    const session = await auth()
    const customer = await getModel<Customer>("Customer", session.user.id)

    const quotaGroup = await getModel<QuotaGroup>("QuotaGroup", slug)

    const quotas = await findModels<Quota>("Quota", {quota_group_id: quotaGroup.id}, {order: 'priority ASC'})

    const conditions = {}
    if (customer.role == 0) {
        conditions["customer_id"] = ['', session.user.id, '1827e53ba48811e8ae8900163e1aebd1']
    }

    const providers = await groupModels<Endpoint>("Endpoint", "provider", conditions)
    console.log(providers)

    const endpoints = await findModels<Endpoint>("Endpoint", conditions, {order: 'provider ASC, model ASC'})

    return (
        <div className="rounded-2xl bg-white px-5 pb-5 pt-5 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
            <div className="align-middle rounded-tl-lg rounded-tr-lg inline-block w-full py-4 overflow-hidden bg-white px-12">
                <div className="flex justify-between">
                    <EditForm obj={{customer_id: session.user.id, quota_group_id: quotaGroup.id, priority: quotas.length + 1}} endpoints={endpoints} quotas={quotas} providers={providers} />
                </div>
            </div>
            <div className="align-middle inline-block min-w-full overflow-hidden bg-white p-8 pt-3 rounded-bl-lg rounded-br-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead></TableHead>
                            <TableHead>供应商</TableHead>
                            <TableHead>模型编码</TableHead>
                            <TableHead>RPM</TableHead>
                            <TableHead>RPD</TableHead>
                            <TableHead>TPM</TableHead>
                            <TableHead>TPD</TableHead>
                            <TableHead>赠送令牌</TableHead>
                            <TableHead>Api Key</TableHead>
                            <TableHead className="text-right"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                    {quotas.map((quota, i) => {
                        const href = "/dashboard/quota/edit/" + quota.id
                        const endpoint = endpoints.find(function(e){ return e.id == quota.endpoint_id}) || endpoints[0]
                        return (
                            <TableRow key={quota.id}>
                                <TableCell className="font-medium">
                                    {i > 0 && (
                                        <EditPriorityForm id={quota.id} direction={-1}></EditPriorityForm>
                                    )}
                                    {i < quotas.length - 1 && (
                                        <EditPriorityForm id={quota.id} direction={1}></EditPriorityForm>
                                    )}
                                </TableCell>
                                <TableCell><Link target="_blank" href={endpoint.site_url} className="text-sm leading-5 text-blue-900">{ endpoint.provider }</Link></TableCell>
                                <TableCell>{endpoint.model}</TableCell>
                                <TableCell>{quota.rpm} / { endpoint.rpm_threshold > 0 ? endpoint.rpm_threshold : '无限制' }</TableCell>
                                <TableCell>{quota.rpd} / { endpoint.rpd_threshold > 0 ? endpoint.rpd_threshold : '无限制' } </TableCell>
                                <TableCell>{quota.tpm} / { endpoint.tpm_threshold > 0 ? endpoint.tpm_threshold : '无限制' } </TableCell>
                                <TableCell>{quota.tpd} / { endpoint.tpd_threshold > 0 ? endpoint.tpd_threshold : '无限制' }</TableCell>
                                <TableCell>{quota.tokens_used} / { endpoint.free_tokens}M</TableCell>
                                <TableCell><CopyButton text={quota.api_key} /></TableCell>
                                <TableCell className="text-right">
                                    <DelForm obj={{model:"Quota", id:quota.id, redirect_url: '/dashboard/quotagroup/view/' + quotaGroup.id}} />
                                </TableCell>
                            </TableRow>
                        )
                    })}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}