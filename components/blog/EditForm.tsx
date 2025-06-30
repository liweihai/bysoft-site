'use client'

import {  useState } from 'react'

import TinyMCEEditor from '@/components/TinyMCEEditor'
import {saveBlog} from "@/lib/actions";

export default function EditForm({id, title, category, keywords, remark, content, state, categories, tags}) {
    const [isPending, setIsPending]   = useState(false)
    const [newContent, setNewContent] = useState(content)

    const handleContentChange = async (e) => {
        setNewContent(e)
    }

    const handleSubmit = async (e) => {
        setIsPending(true)

        e.preventDefault()

        const formData = new FormData(e.target); // Collect form data
        formData.append('content', newContent)

        const result = await saveBlog(null, formData)

        setIsPending(false)
    }

    return (
        <div className="mx-auto p-4">
            <form onSubmit={handleSubmit}>
                <input type="hidden" name="id" value={id} />

                <div className="mb-6">
                    <label htmlFor="title" className="block text-lg font-medium text-gray-800 mb-1">标题</label>
                    <input type="text" defaultValue={title} id="title" name="title" className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" required />
                </div>

                <div className="mb-6">
                    <label htmlFor="category" className="block text-lg font-medium text-gray-800 mb-1">分类</label>   
                    <div className="relative">
                        <select id="category" name="category" defaultValue={category} className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer">
                        {categories.map((category) => {
                            return (
                            <option key={category} value={category}>{category}</option>
                            )
                        })}
                        </select>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.2" stroke="currentColor" className="h-5 w-5 ml-1 absolute top-2.5 right-2.5 text-slate-700">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                        </svg>
                    </div>
                </div>

                <div className="mb-6">
                    <label htmlFor="keywords" className="block text-lg font-medium text-gray-800 mb-1">标签</label>   
                    <div className="relative">
                        <select multiple id="keywords" name="keywords" defaultValue={keywords} className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer">
                        {tags.map((tag) => {
                            return (
                            <option key={tag} value={tag}>{tag}</option>
                            )
                        })}
                        </select>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.2" stroke="currentColor" className="h-5 w-5 ml-1 absolute top-2.5 right-2.5 text-slate-700">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                        </svg>
                    </div>
                </div>

                <div className="mb-6">
                    <label htmlFor="remark" className="block text-lg font-medium text-gray-800 mb-1">摘要</label>
                    <textarea defaultValue={remark} id="remark" name="remark" className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" />
                </div>

                <div className="mb-6">
                    <label htmlFor="content" className="block text-lg font-medium text-gray-800 mb-1">内容</label>
                    <TinyMCEEditor onChange={handleContentChange} initialValue={newContent} />
                </div>

                <div className="mb-6">
                    <label htmlFor="state" className="block text-lg font-medium text-gray-800 mb-1">状态</label>   
                    <div className="relative">
                        <select id="state" name="state" defaultValue={state} className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer">
                            <option value={0}>下线</option>
                            <option value={1}>上线</option>
                        </select>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.2" stroke="currentColor" className="h-5 w-5 ml-1 absolute top-2.5 right-2.5 text-slate-700">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                        </svg>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button type="submit" className="px-6 py-2 bg-indigo-500 text-white font-semibold rounded-md hover:bg-indigo-600 focus:outline-none">{isPending ? "保存文章中..." : "保存文章"}</button>
                </div>
            </form>
        </div>
    )
}