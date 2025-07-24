'use client'

import {useState, useActionState} from 'react'
import { useRouter } from 'next/navigation'

import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
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
import { toast } from "sonner"

import { deleteOne } from "@/lib/actions";

const formSchema = z.object({
    id: z.string(),
    model: z.string()
})

export default function DelForm({obj}) {
    const [isPending, setIsPending] = useState(false);

    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: obj.id || "",
            model: obj.model || ""
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsPending(true);

        try {
            await deleteOne(values.model, values.id)

            toast.success("数据已经删除")

            router.refresh()
        } catch (error) {
            toast.error(error.message)
        }
        
        setIsPending(false);
    }

    return (
        <>
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive">{isPending ? "删除中..." : "删除"}</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>确定删除吗？</AlertDialogTitle>
                <AlertDialogDescription>
                    删除数据无法恢复！
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>取消</AlertDialogCancel>
                <AlertDialogAction asChild>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <Button type="submit">确定</Button>
                        </form>
                    </Form>
                </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
            </AlertDialog>
        </>
    )
}