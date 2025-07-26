'use client';
 
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation'

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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

import { authenticate } from "@/lib/actions";

const formSchema = z.object({
    username: z.string().min(2, {
        message: "名称至少 2 个字符.",
    }),
    password: z.string().min(1, {
        message: "密码至少 8 个字符.",
    })
})

export default function LoginForm() {
    const searchParams = useSearchParams();
    const callbackUrl  = searchParams.get('callbackUrl') || '/dashboard';

    const [isPending, setIsPending] = useState(false);
    const [isGithubPending, setIsGithubPending] = useState(false);

    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: ""
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsPending(true);

        try {
            await authenticate('credentials', {
                redirect: false,
                username: values.username,
                password: values.password,
            })

            toast.success("登录成功，欢迎回家")

            router.push(callbackUrl)
        } catch (error) {
            toast.error("用户名和密码错误")
        }
        
        setIsPending(false);
    }

    async function handleGithubLogin() {
        setIsGithubPending(true);

        try {
            await authenticate('github', {callbackUrl : callbackUrl})

            toast.success("登录成功，欢迎回家")

            router.push(callbackUrl)
        } catch (error) {
            toast.error("用户名和密码错误")
        }
        
        setIsGithubPending(false);

    }
    
    return (
        <div className="flex flex-col gap-6">
            <Card className="relative py-6 sm:max-w-xl sm:mx-auto w-[24rem]">
                <CardHeader>
                    <CardTitle>欢迎回来</CardTitle>
                    <CardDescription>
                        请输入您的用户名和密码登录
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField control={form.control} name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>用户名</FormLabel>
                                        <FormControl>
                                            <Input placeholder="用户名" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField control={form.control} name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>密码</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="密码" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" variant="default"className="w-full">{isPending ? "登录中..." : "登录"}</Button>
                        </form>
                    </Form>
                    <Button onClick={handleGithubLogin} variant="outline" className="w-full mt-3 invisible">{isGithubPending ? "Github 登录中..." : "Github 登录"}</Button>
                </CardContent>
            </Card>
        </div>
    );
}