import Link from 'next/link';

import {countModels, findModels} from "@/lib/data"
import {Endpoint} from "@/lib/definitions"
import Search from "@/components/Search"

export default async function EndpointPage() {
    const endpoints = await findModels<Endpoint>("Endpoint", {}, {order: 'create_time DESC'})

    return (
        <div className="rounded-2xl bg-white px-5 pb-5 pt-5 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
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
                    {endpoints.map((endpoint) => {
                    const href = "/dashboard/endpoint/edit/" + endpoint.id
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
                    </tr>
                    )
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}