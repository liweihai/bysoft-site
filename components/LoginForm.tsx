'use client';
 
import {
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { useActionState } from 'react';
import { useSearchParams } from 'next/navigation';

import { authenticate } from '@/lib/actions';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginForm() {
    const searchParams = useSearchParams();
    const callbackUrl  = searchParams.get('callbackUrl') || '/dashboard';
    const [errorMessage, formAction, isPending] = useActionState(
        authenticate,
        undefined,
    );
  
    return (
        <div className="flex flex-col gap-6">
          <Card className="relative py-6 sm:max-w-xl sm:mx-auto w-[24rem]">
              <CardHeader>
                  <CardTitle>欢迎回来</CardTitle>
                  <CardDescription>
                    请输入您的电子邮箱登录
                  </CardDescription>
              </CardHeader>
              <CardContent>
                  <form action={formAction}>
                      <input type="hidden" name="redirectTo" value={callbackUrl} />
                      <div className="flex flex-col gap-6">
                          <div className="grid gap-3">
                              <Label htmlFor="email">电子邮箱</Label>
                              <Input
                                id="email"
                                name="username"
                                type="text"
                                placeholder="m@example.com"
                                required
                              />
                          </div>
                          <div className="grid gap-3">
                              <div className="flex items-center">
                                <Label htmlFor="password">密码</Label>
                              </div>
                              <Input id="password" name="password" type="password" required />
                          </div>
                          <div className="flex flex-col gap-3">
                              <Button type="submit" className="w-full">
                                登 录
                              </Button>
                          </div>
                      </div>
                  </form>
                  <div className="flex h-8 items-end space-x-1" aria-live="polite" aria-atomic="true">
                      {errorMessage && (
                        <>
                          <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                          <p className="text-sm text-red-500">{errorMessage}</p>
                        </>
                      )}
                  </div>
              </CardContent>

          </Card>
        </div>
    );
}