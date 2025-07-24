'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { saveConfig } from "@/lib/actions";

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
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

const formSchema = z.object({
    id: z.string(),
    name: z.string().min(2, {
        message: "名称至少 2 个字符.",
    }),
    value: z.string().min(1, {
        message: "值不能为空",
    }),
})

export default function EditForm({obj}) {
    const [isPending, setIsPending] = useState(false);

    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: obj.id || "",
            name: obj.name || "",
            value: obj.value || ""
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsPending(true);

        try {
            await saveConfig(values)

            toast.success("配置保存成功")

            router.push('/dashboard/config')
        } catch (error) {
            toast.error(error.message)
        }

        setIsPending(false);
    }

    return (
      <div className="mx-auto p-4">
          <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormField control={form.control} name="name"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>名称</FormLabel>
                              <FormControl>
                                <Input placeholder="名称" {...field} />
                              </FormControl>
                              <FormMessage />
                          </FormItem>
                      )}
                  />
                  <FormField control={form.control} name="value"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>值</FormLabel>
                              <FormControl>
                                <Input placeholder="值" {...field} />
                              </FormControl>
                              <FormMessage />
                          </FormItem>
                      )}
                  />
                  <Button type="submit">{isPending ? "保存配置中..." : "保存配置"}</Button>
              </form>
          </Form>
      </div>
    )
}