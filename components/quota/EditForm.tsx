'use client'

import Link from 'next/link';
import { useState, useActionState } from 'react'

import {saveQuota} from "@/lib/actions";
import { Button } from "@/components/ui/button"

export default function EditForm({obj, providers, endpoints, quotas}) {
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
                <div className="grid md:grid-cols-2 gap-4">
                    <input type="hidden" name="id" value={obj.id} />
                    <input type="hidden" name="customer_id" value={obj.customer_id} />
                    <input type="hidden" name="quota_group_id" value={obj.quota_group_id} />
                    <input type="hidden" name="priority" value={obj.priority} />

                    <div className="mb-6">
                        <label htmlFor="endpoint_id" className="block text-lg font-medium text-gray-800 mb-1">大模型</label>   
                        <div className="relative">
                            <select id="endpoint_id" onChange={handleChangeEndpointId} name="endpoint_id" className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer" required>
                            {providers.map((provider) => {
                                return (
                                    <optgroup label={provider.provider} key={provider.provider}>
                                    {endpoints.map((endpoint) => {
                                        if (endpoint.provider == provider.provider) {
                                            const found = quotas.find(function(q){return q.endpoint_id == endpoint.id})
                                            if (found) {
                                                return (
                                                    <option disabled key={endpoint.id} value={endpoint.id}>{endpoint.model}</option>
                                                )
                                            } else {
                                                return (
                                                    <option key={endpoint.id} value={endpoint.id}>{endpoint.model}</option>
                                                )
                                            }
                                        }
                                    })}
                                    </optgroup>
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
                </div>

                <div className="flex justify-end">
                    <Button variant="secondary" asChild><Link href={ href } target="_blank" >去官网申请 Api Key</Link></Button>
                    <Button type="submit">{isPending ? "增加大模型中..." : "增加大模型"}</Button>
                </div>
            </form>
        </div>
    )
}