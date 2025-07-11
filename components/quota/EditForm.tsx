'use client'

import Link from 'next/link';
import { useState, useActionState } from 'react'

import {saveQuota} from "@/lib/actions";

export default function EditForm({obj, endpoints}) {
    const [message, formAction, isPending] = useActionState(saveQuota, undefined);

    const [endpointId, setEndpointId] = useState(obj.endpoint_id || endpoints[0].id)

    const endpoint = endpoints.find(function(e) { return e.id == endpointId })
    const [href, setHref] = useState(endpoint.site_url)

    const handleChangeEndpointId = event => {
        setEndpointId(event.target.value);

        const endpoint = endpoints.find(function(e) { return e.id == event.target.value })
        setHref(endpoint.site_url)
    };

    return (
        <div className="min-w-full">
            <form action={formAction}>
                <div className="grid md:grid-cols-3 gap-4">
                    <input type="hidden" name="id" value={obj.id} />
                    <input type="hidden" name="customer_id" value={obj.customer_id} />
                    <input type="hidden" name="quota_group_id" value={obj.quota_group_id} />

                    <div className="mb-6">
                        <label htmlFor="endpoint_id" className="block text-lg font-medium text-gray-800 mb-1">大模型</label>   
                        <div className="relative">
                            <select id="endpoint_id" onChange={handleChangeEndpointId} name="endpoint_id" defaultValue={endpointId} className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer">
                            {endpoints.map((endpoint) => {
                                return (
                                <option key={endpoint.id} value={endpoint.id}>{endpoint.provider}{endpoint.model}</option>
                                )
                            })}
                            </select>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.2" stroke="currentColor" className="h-5 w-5 ml-1 absolute top-2.5 right-2.5 text-slate-700">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                            </svg>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="api_key" className="block text-lg font-medium text-gray-800 mb-1">Api Key</label>
                        <input type="text" defaultValue={obj.api_key} id="api_key" name="api_key" className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" required />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="priority" className="block text-lg font-medium text-gray-800 mb-1">优先级</label>
                        <input type="number" defaultValue={obj.priority} id="priority" name="priority" className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" required />
                    </div>
                </div>

                <div className="flex justify-end">
                    <button className="px-5 py-2 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none mr-3"><Link href={ href } target="_blank" >申请Api Key</Link></button>
                    <button type="submit" className="px-6 py-2 bg-indigo-500 text-white font-semibold rounded-md hover:bg-indigo-600 focus:outline-none">{isPending ? "增加大模型中..." : "增加大模型"}</button>
                </div>
            </form>
        </div>
    )
}