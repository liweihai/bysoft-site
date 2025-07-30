'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { savePrompt } from "@/lib/actions";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

const formSchema = z.object({
    id: z.string(),
    customer_id: z.string(),
    category: z.string(),
    content_type: z.number(),
    state: z.number(),
    title: z.string().min(1, {
        message: "标题不能为空.",
    }),
    keywords: z.string(),
    remark: z.string(),
    content: z.string().min(1, {
        message: "内容不能为空.",
    })
})

export default function EditForm({obj}) {
    const [isPending, setIsPending] = useState(false);

    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: obj.id || "",
            customer_id: obj.customer_id || "",
            category: '提示语',
            content_type: 1,
            state: 0,
            title: obj.title || "",
            keywords: obj.keywords || "",
            remark: obj.remark || "",
            content: obj.content || ""
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsPending(true);

        const result = await savePrompt(values)

        if (result.code == 0) {
            router.push('/dashboard/prompt')

            toast.success("提示词保存成功")
        } else {
            toast.error(result.message)
        }
        
        setIsPending(false);
    }

    return (
        <div className="mx-auto p-4">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField control={form.control} name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>标题</FormLabel>
                                <FormControl>
                                <Input placeholder="请输入标题" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField control={form.control} name="keywords"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>标签</FormLabel>
                                <FormControl>
                                <Input placeholder="请输入标签，用英文逗号分割，空白则由 AI 根据内容自动生成" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField control={form.control} name="remark"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>摘要</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="请输入摘要，空白则由 AI 根据内容自动生成" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField control={form.control} name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>提示词</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="请输入提示词" className="max-h-[480px] resize-none" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">{isPending ? "保存提示词中..." : "保存提示词"}</Button>
                </form>
            </Form>
        </div>
    )
}