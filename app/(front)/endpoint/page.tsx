import Link from 'next/link';

import {countModels, findModels} from "@/lib/data"
import {Endpoint, Quota} from "@/lib/definitions"
import Search from "@/components/Search"

export default async function EndpointPage() {
    const quotas = await findModels<Quota>("Quota", {quota_group_id: 'G38i97eeKG2KgpxW-nvf_'}, {order: 'priority ASC'})

    const endpoints = await findModels<Endpoint>("Endpoint")

    return (
        <div className="rounded-2xl bg-white px-5 pb-5 pt-5 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
            <div className="space-y-2 pt-6 pb-8 md:space-y-5">
                <h1 className="text-3xl lg:text-4xl text-center mb-6 tracking-wider">
                Single LLM
                </h1>
            </div>
            <dl>
                <div>
                    <dd className="tracking-wide text-sm mb-6 leading-relaxed mx-auto max-w-xl text-center">
                        兼容 Open Api 的大模型访问 Api。依次访问下列多个大模型，如果成功则返回成功结果，如果失败继续尝试下一个大模型，直到所有大模型都返回失败。
                    </dd>
                </div>
            </dl>

            <div className="align-middle inline-block min-w-full overflow-hidden bg-white pt-3 rounded-bl-lg rounded-br-lg">
                <table className="min-w-full">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">供应商</th>
                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">模型名</th>
                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">RPM</th>
                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">RPD</th>
                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">TPM</th>
                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">TPD</th>
                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">赠送</th>
                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">模态</th>
                            <th className="px-6 py-3 border-b-2 border-gray-300"></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                    {quotas.map((quota) => {
                    const endpoint = endpoints.find(function(e){ return e.id == quota.endpoint_id})
                    return (
                    <tr key={endpoint.id}>
                        <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                            <Link target="_blank" href={endpoint.site_url} className="text-sm leading-5 text-blue-900">{ endpoint.provider }</Link>
                        </td>
                        <td className="px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">{endpoint.model}</td>
                        <td className="px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                            { endpoint.rpm_threshold > 0 ? endpoint.rpm_threshold : '/' }
                        </td>
                        <td className="px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                            { endpoint.rpd_threshold > 0 ? endpoint.rpd_threshold : '/' } 
                        </td>
                        <td className="px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                           { endpoint.tpm_threshold > 0 ? endpoint.tpm_threshold : '/' } 
                        </td>
                        <td className="px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                           { endpoint.tpd_threshold > 0 ? endpoint.tpd_threshold : '/' }
                        </td>
                        <td className="px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                            { endpoint.free_tokens}
                        </td>
                        <td className="px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                            { endpoint.modals}
                        </td>
                        <td className="px-6 py-4 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5">
                            <button className="px-5 py-2 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none mr-3"><Link href={ endpoint.site_url }>申请</Link></button>
                        </td>
                    </tr>
                    )
                    })}
                    </tbody>
                </table>
            </div>

            <div className="bg-white m-auto my-10 shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Single LLM Api（兼容 Open Api）
                    </h3>
                </div>
                <div className="border-t border-gray-200">
                    <dl>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                链接
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                https://www.bysoft.site/api/single-llm/v1
                            </dd>
                        </div>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                Api Key
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                上列免费大模型的 Api Key，用,分割，不使用某个大模型则直接用，。
                            </dd>
                        </div>
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                模型名
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                free-text-model
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    )
}