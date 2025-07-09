import Link from 'next/link';

import {countModels, findModels} from "@/lib/data"
import {QuotaGroup} from "@/lib/definitions"
import { auth } from '@/auth';

export default async function EndpointPage() {
    const session = await auth()

    const conditions = {customer_id: session.user.id}
    const quotaGroups = await findModels<QuotaGroup>("QuotaGroup", conditions, {})

    return (
        <div className="rounded-2xl bg-white px-5 pb-5 pt-5 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
            <div className="align-middle rounded-tl-lg rounded-tr-lg inline-block w-full py-4 overflow-hidden bg-white px-12">
                <div className="flex justify-between">
                    <div> </div>
                    <button className="mx-5 px-5 py-2 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none"><Link href="/dashboard/quotagroup/create">创建模型组</Link></button>
                </div>
            </div>
            <div className="align-middle inline-block min-w-full overflow-hidden bg-white p-8 pt-3 rounded-bl-lg rounded-br-lg">
                <table className="min-w-full">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">名称</th>
                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">算法</th>
                            <th className="px-6 py-3 border-b-2 border-gray-300"></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                    {quotaGroups.map((quotagroup) => {
                    const href = "/dashboard/quotagroup/edit/" + quotagroup.id
                    return (
                    <tr key={quotagroup.id}>
                        <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                            { quotagroup.name }
                        </td>
                        <td className="px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">{quotagroup.algorithm}</td>
                        <td className="px-6 py-4 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5">
                            <button className="px-5 py-2 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none"><Link href={ href }>修改</Link></button>
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