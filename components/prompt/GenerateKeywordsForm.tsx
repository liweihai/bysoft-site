'use client'

import {useState, useActionState} from 'react'
import {generatePromptKeywords} from "@/lib/actions";
import { useRouter } from 'next/navigation'

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
    id: z.string()
})

export default function GetenrateKeywordsForm({obj}) {
    const [isPending, setIsPending] = useState(false);

    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: obj.id || ""
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsPending(true);

        const result = await generatePromptKeywords(values)

        if (result.code == 0) {
            router.push('/dashboard/prompt')

            toast.success("标签生成成功")
        } else {
            toast.error(result.message)
        }
        
        setIsPending(false);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Button variant="secondary" type="submit">{isPending ? "生成标签中..." : "生成标签"}</Button>
            </form>
        </Form>
    )
}