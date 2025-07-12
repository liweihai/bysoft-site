import Link from 'next/link';

import {findModels, getModel} from "@/lib/data"
import {QuotaGroup, Quota, Endpoint} from "@/lib/definitions"
import { auth } from '@/auth';
import DelForm from '@/components/DelForm';
import EditForm from '@/components/quota/EditForm';

export default async function QuotaGroupViewPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params
    const slug = params.slug

    const quotaGroup = await getModel<QuotaGroup>("QuotaGroup", slug)

    const quotas = await findModels<Quota>("Quota", {quota_group_id: quotaGroup.id}, {order: 'priority ASC'})

    const endpoints = await findModels<Endpoint>("Endpoint")

    const session = await auth()

    return (
        <div className="rounded-2xl bg-white px-5 pb-5 pt-5 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
            <div className="align-middle rounded-tl-lg rounded-tr-lg inline-block w-full py-4 overflow-hidden bg-white px-12">
                <div className="flex justify-between">
                    <EditForm obj={{customer_id: session.user.id, quota_group_id: quotaGroup.id, priority: quotas.length + 1}} endpoints={endpoints} />
                </div>
            </div>
            <div className="align-middle inline-block min-w-full overflow-hidden bg-white p-8 pt-3 rounded-bl-lg rounded-br-lg">
                <table className="min-w-full">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">供应商</th>
                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">大模型</th>
                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">请求数/分钟</th>
                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">请求数/天</th>
                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">令牌数/分钟</th>
                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">令牌数/天</th>
                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">赠送令牌</th>
                            <th className="px-6 py-3 border-b-2 border-gray-300"></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                    {quotas.map((quota) => {
                    const href = "/dashboard/quota/edit/" + quota.id
                    const endpoint = endpoints.find(function(e){ return e.id == quota.endpoint_id}) || endpoints[0]
                    return (
                    <tr key={quota.id}>
                        <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                            <Link target="_blank" href={endpoint.site_url} className="text-sm leading-5 text-blue-900">{ endpoint.provider }</Link>
                        </td>
                        <td className="px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">{endpoint.model}</td>
                        <td className="px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                            {quota.rpm} / { endpoint.rpm_threshold > 0 ? endpoint.rpm_threshold : '无限制' }
                        </td>
                        <td className="px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                            {quota.rpd} / { endpoint.rpd_threshold > 0 ? endpoint.rpd_threshold : '无限制' } 
                        </td>
                        <td className="px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                           {quota.tpm} / { endpoint.tpm_threshold > 0 ? endpoint.tpm_threshold : '无限制' } 
                        </td>
                        <td className="px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                           {quota.tpd} / { endpoint.tpd_threshold > 0 ? endpoint.tpd_threshold : '无限制' }
                        </td>
                        <td className="px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                            {quota.tokens_used} / { endpoint.free_tokens}
                        </td>
                        <td className="px-6 py-4 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5">
                             <DelForm obj={{model:"Quota", id:quota.id, redirect_url: '/dashboard/quotagroup/view/' + quotaGroup.id}} />
                        </td>
                    </tr>
                    )
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}