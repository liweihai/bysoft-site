import Link from 'next/link';

import {countModels, findModels} from "@/lib/data"
import {Cooperation} from "@/lib/definitions"
import { auth } from '@/auth';
import DelForm from '@/components/DelForm';
import {formatDate} from '@/utils/datetime'

export default async function CooperationPage() {
    const cooperations = await findModels<Cooperation>("Cooperation", {}, {order: 'create_time DESC'})

    return (
        <div className="rounded-2xl bg-white px-5 pb-5 pt-5 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
            <div className="align-middle inline-block min-w-full overflow-hidden bg-white p-8 pt-3 rounded-bl-lg rounded-br-lg">
                <table className="min-w-full">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">姓名</th>
                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">联系方式</th>
                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">留言内容</th>
                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">留言时间</th>
                            <th className="px-6 py-3 border-b-2 border-gray-300"></th>
                         </tr>
                    </thead>
                    <tbody className="bg-white">
                    {cooperations.map((cooperation) => {
                    return (
                    <tr key={cooperation.id}>
                        <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                            { cooperation.name }
                        </td>
                        <td className="px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">{cooperation.phone}</td>
                        <td className="px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">{cooperation.description}</td>
                        <td className="px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">{formatDate(cooperation.create_time)}</td>
                        <td className="px-6 py-4 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5">
                            <DelForm obj={{model:"Cooperation", id:cooperation.id, redirect_url:"/dashboard"}} />
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