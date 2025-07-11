'use client'

import {  useState, useActionState } from 'react'

import {saveQuotaGroup} from "@/lib/actions";

export default function EditForm({obj, algorithms}) {
    const [message, formAction, isPending] = useActionState(saveQuotaGroup, undefined);

    return (
        <div className="mx-auto p-4">
            <form action={formAction}>
                <input type="hidden" name="id" value={obj.id} />
                <input type="hidden" name="customer_id" value={obj.customer_id} />

                <div className="mb-6">
                    <label htmlFor="name" className="block text-lg font-medium text-gray-800 mb-1">名称</label>
                    <input type="text" defaultValue={obj.name} id="name" name="name" className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" required />
                </div>

                <div className="mb-6">
                    <label htmlFor="algorithm" className="block text-lg font-medium text-gray-800 mb-1">算法</label>   
                    <div className="relative">
                        <select id="algorithm" name="algorithm" defaultValue={obj.algorithm} className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer">
                        {algorithms.map((algorithm) => {
                            return (
                            <option key={algorithm} value={algorithm}>{algorithm}</option>
                            )
                        })}
                        </select>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.2" stroke="currentColor" className="h-5 w-5 ml-1 absolute top-2.5 right-2.5 text-slate-700">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                        </svg>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button type="submit" className="px-6 py-2 bg-indigo-500 text-white font-semibold rounded-md hover:bg-indigo-600 focus:outline-none">{isPending ? "保存模型组中..." : "保存模型组"}</button>
                </div>
            </form>
        </div>
    )
}