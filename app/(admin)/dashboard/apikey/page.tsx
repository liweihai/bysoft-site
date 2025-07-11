import Link from 'next/link';

import {countModels, findModels} from "@/lib/data"
import {ApiKey} from "@/lib/definitions"
import {auth} from '@/auth';
import {formatDate} from '@/utils/datetime'
import {createApiKey} from "@/lib/actions";
import EditForm from '@/components/apikey/EditForm';
import DelForm from '@/components/DelForm';

export default async function ApiKeyPage() {
    const session = await auth()

    const conditions = {customer_id: session.user.name}
    const apiKeys = await findModels<ApiKey>("ApiKey", conditions, {})

    return (
        <div className="rounded-2xl bg-white px-5 pb-5 pt-5 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
            <div className="align-middle rounded-tl-lg rounded-tr-lg inline-block w-full py-4 overflow-hidden bg-white px-12">
                <div className="flex justify-between">
                    <div> </div>
                    <EditForm obj={{customer_id: session.user.name}} />
                </div>
            </div>
            <div className="align-middle inline-block min-w-full overflow-hidden bg-white p-8 pt-3 rounded-bl-lg rounded-br-lg">
                <table className="min-w-full">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">Api Key</th>
                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">创建时间</th>
                            <th className="px-6 py-3 border-b-2 border-gray-300"></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                    {apiKeys.map((apiKey) => {
                    return (
                    <tr key={apiKey.id}>
                        <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                            { apiKey.id }
                        </td>
                        <td className="px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">{formatDate(apiKey.create_time)}</td>
                        <td className="px-6 py-4 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5">
                            <DelForm obj={{model:"ApiKey", id:apiKey.id}} />
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