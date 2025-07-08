'use client'

import {  useState, useActionState } from 'react'

import {saveEndpoint} from "@/lib/actions";

export default function EditForm({obj}) {
    const [message, formAction, isPending] = useActionState(saveEndpoint, undefined);

    return (
        <div className="mx-auto p-4">
            <form action={formAction}>
                <input type="hidden" name="id" value={obj.id} />

                <div className="mb-6">
                    <label htmlFor="provider" className="block text-lg font-medium text-gray-800 mb-1">供应商</label>
                    <input type="text" defaultValue={obj.provider} id="provider" name="provider" className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" required />
                </div>

                <div className="mb-6">
                    <label htmlFor="site_url" className="block text-lg font-medium text-gray-800 mb-1">注册网址</label>
                    <input type="text" defaultValue={obj.site_url} id="site_url" name="site_url" className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" required />
                </div>

                <div className="mb-6">
                    <label htmlFor="base_url" className="block text-lg font-medium text-gray-800 mb-1">API网址</label>
                    <input type="text" defaultValue={obj.base_url} id="base_url" name="base_url" className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" required />
                </div>

                <div className="mb-6">
                    <label htmlFor="model" className="block text-lg font-medium text-gray-800 mb-1">大模型</label>
                    <input type="text" defaultValue={obj.model} id="model" name="model" className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" required />
                </div>

                <div className="mb-6">
                    <label htmlFor="rpm_threshold" className="block text-lg font-medium text-gray-800 mb-1">每分钟请求限额 RPM</label>
                    <input type="number" defaultValue={obj.rpm_threshold || 0} id="rpm_threshold" name="rpm_threshold" className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" required />
                </div>

                <div className="mb-6">
                    <label htmlFor="rpd_threshold" className="block text-lg font-medium text-gray-800 mb-1">每天请求限额 RPD</label>
                    <input type="number" defaultValue={obj.rpd_threshold || 0} id="rpd_threshold" name="rpd_threshold" className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" required />
                </div>

                <div className="mb-6">
                    <label htmlFor="tpm_threshold" className="block text-lg font-medium text-gray-800 mb-1">每分钟Token限额 TPM</label>
                    <input type="number" defaultValue={obj.tpm_threshold || 0} id="tpm_threshold" name="tpm_threshold" className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" required />
                </div>

                <div className="mb-6">
                    <label htmlFor="tpd_threshold" className="block text-lg font-medium text-gray-800 mb-1">每天Token限额 TPD</label>
                    <input type="number" defaultValue={obj.tpd_threshold || 0} id="tpd_threshold" name="tpd_threshold" className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" required />
                </div>

                <div className="mb-6">
                    <label htmlFor="free_tokens" className="block text-lg font-medium text-gray-800 mb-1">赠送Token</label>
                    <input type="number" defaultValue={obj.free_tokens || 0} id="free_tokens" name="free_tokens" className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" required />
                </div>

                <div className="mb-6">
                    <label htmlFor="description" className="block text-lg font-medium text-gray-800 mb-1">大模型简介</label>
                    <textarea defaultValue={obj.description} id="description" name="description" className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" />
                </div>

                <div className="mb-6">
                    <label htmlFor="state" className="block text-lg font-medium text-gray-800 mb-1">状态</label>   
                    <div className="relative">
                        <select id="state" name="state" defaultValue={obj.state} className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer">
                            <option value={0}>下线</option>
                            <option value={1}>上线</option>
                        </select>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.2" stroke="currentColor" className="h-5 w-5 ml-1 absolute top-2.5 right-2.5 text-slate-700">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                        </svg>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button type="submit" className="px-6 py-2 bg-indigo-500 text-white font-semibold rounded-md hover:bg-indigo-600 focus:outline-none">{isPending ? "保存大模型中..." : "保存大模型"}</button>
                </div>
            </form>
        </div>
    )
}