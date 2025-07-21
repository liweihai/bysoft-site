'use client'

import {  useActionState, useState } from 'react'

import {savePrompt} from "@/lib/actions";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export default function EditForm({obj, tags}) {
    const [isPending, setIsPending] = useState(false);

    const keywordsInit : string[] = obj && obj.keywords ? obj.keywords.split(',') : []
    const [keywords, setKeywords] = useState(keywordsInit)

    const handleKeywordsChange = (tag) => {
        const newKeywords = []

        let found = false
        for(var i = 0; i < keywords.length; i++) {
            if (keywords[i] == tag) {
                found = true
            } else {
                newKeywords.push(keywords[i])
            }
        }
        if (!found){
            newKeywords.push(tag)
        }
        
        setKeywords(newKeywords)
    }

    async function handleSubmit(e) {
        e.preventDefault();

        setIsPending(true);

        const formData = new FormData(e.target);

        for(var i = 0; i < keywords.length; i++) {
            formData.append("keywords", keywords[i]);
        }

        await savePrompt(null, formData)
        
        setIsPending(false);
    }

    return (
        <div className="mx-auto p-4">
            <form onSubmit={handleSubmit}>
                <input type="hidden" name="id" value={obj.id} />
                <input type="hidden" name="customer_id" value={obj.customer_id} />
                <input type="hidden" name="category" value="提示语" />
                <input type="hidden" name="content_type" value={1} />
                <input type="hidden" name="state" value={0} />

                <div className="mb-6">
                    <label htmlFor="title" className="block text-lg font-medium text-gray-800 mb-1">标题</label>
                    <Input type="text" defaultValue={obj.title} id="title" name="title" className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" required />
                </div>

                <div className="mb-6">
                    <label htmlFor="keywords" className="block text-lg font-medium text-gray-800 mb-1">标签</label>   
                    <div className="relative flex flex-row gap-3">
                        {tags.map((tag) => {
                            const checked = keywords.indexOf(tag) >= 0
                            return (
                            <div className="flex items-start gap-3" key={tag}>
                                <Checkbox id={tag} checked={checked} onClick={e => handleKeywordsChange(tag)}></Checkbox>
                                <Label htmlFor={tag}>{tag}</Label>
                            </div>
                            )
                        })}
                    </div>
                </div>

                <div className="mb-6">
                    <label htmlFor="remark" className="block text-lg font-medium text-gray-800 mb-1">摘要</label>
                    <Textarea defaultValue={obj.remark} id="remark" name="remark" className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" />
                </div>

                <div className="mb-6">
                    <label htmlFor="content" className="block text-lg font-medium text-gray-800 mb-1">内容</label>
                    <Textarea defaultValue={obj.content} id="content" name="content" className="min-h-[600px] resize-y w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" />
                </div>

                <div className="flex justify-end">
                    <Button type="submit">{isPending ? "保存提示词中..." : "保存提示词"}</Button>
                </div>
            </form>
        </div>
    )
}