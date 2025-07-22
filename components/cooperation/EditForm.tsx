'use client'

import { useActionState, useState } from 'react'

import {createCooperation} from "@/lib/actions";

import {
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function EditForm() {
    const [message, formAction, isPending] = useActionState(createCooperation, undefined);

    return (
        <section className="body-font relative">
            <div className="container mx-auto px-5 py-24">
                <div className="mx-auto md:w-2/3 lg:w-1/2">
                    <form action={formAction} className="-m-2 flex flex-wrap">
                        <div className="w-1/2 p-2">
                            <div className="relative">
                                <input required type="text" id="name" name="name" className="peer w-full rounded border border-gray-700 bg-opacity-40 py-1 px-3 text-base leading-8 placeholder-transparent outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900" placeholder="姓名" />
                                <label htmlFor="name" className="absolute left-3 -top-6 bg-transparent text-sm leading-7 text-indigo-500 transition-all peer-placeholder-shown:left-3 peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:left-3 peer-focus:-top-6 peer-focus:text-sm peer-focus:text-indigo-500">姓名</label>
                            </div>
                        </div>
                        <div className="w-1/2 p-2">
                            <div className="relative">
                                <input required type="text" id="phone" name="phone" className="peer w-full rounded border border-gray-700 bg-opacity-40 py-1 px-3 text-base leading-8 placeholder-transparent outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900" placeholder="联系方式" />
                                <label htmlFor="phone" className="absolute left-3 -top-6 bg-transparent text-sm leading-7 text-indigo-500 transition-all peer-placeholder-shown:left-3 peer-placeholder-shown:top-2  peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:left-3 peer-focus:-top-6 peer-focus:text-sm peer-focus:text-indigo-500">联系方式</label>
                            </div>
                        </div>
                        <div className="mt-4 w-full p-2">
                            <div className="relative">
                                <textarea required id="description" name="description" className="peer h-32 w-full resize-none rounded border border-gray-700 bg-opacity-40 py-1 px-3 text-base leading-6 placeholder-transparent outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900" placeholder="留言内容"></textarea>
                                <label htmlFor="description" className="absolute left-3 -top-6 bg-transparent text-sm leading-7 text-indigo-500 transition-all peer-placeholder-shown:left-3 peer-placeholder-shown:top-2  peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:left-3 peer-focus:-top-6 peer-focus:text-sm peer-focus:text-indigo-500">留言内容</label>
                            </div>
                        </div>
                        <div className="w-full p-2">
                            <Button type="submit"  className="mx-auto flex">{isPending ? "提交中..." : "提交"}</Button>
                        </div>

                        <div className="mt-8 w-full border-t border-gray-800 p-2 pt-8 text-center">
                            <a className="text-indigo-400">support@bysoft.site</a>
                            <p className="my-5 leading-normal"></p>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    )
}