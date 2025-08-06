'use client'

import { useActionState, useState } from 'react'
import {aiChat} from "@/lib/actions";
import { Chat, ChatMessage } from "@/lib/definitions";
import Image from "next/image";

export default function ChatForm({obj, chatInit}) {
    const regexp  = /{{.+}}/g
    let matches = obj.content.match(regexp)
    matches = [...new Set(matches)]

    const [chat, setChat] = useState(chatInit)

    const changeBaseUrl = (e: any) => {
        let baseUrl = e.target.value

        setChat({...chat, base_url: baseUrl})
    }

    const changeModel = (e: any) => {
        let model = e.target.value

        setChat({...chat, model: model})
    }

    const changeApiKey = (e: any) => {
        let apiKey = e.target.value

        setChat({...chat, api_key: apiKey})
    }

    const handleCopy = async (text) => {
        await navigator.clipboard.writeText(text);
    }

    const [newChat, formAction, isPending] = useActionState(aiChat, chat);

    return (
        <div className="flexw-full flex-col">
            <div
                className=" h-[85vh] flex-1 overflow-y-auto bg-slate-300 text-sm leading-6 text-slate-900 shadow-md dark:bg-slate-800 dark:text-slate-300 sm:text-base sm:leading-7"
            >
                {(newChat || chat).messages.map((message, i) => {
                    return (
                        <div className="m-4" key={i}>
                        {message.role == 'user' && (
                            <div className="flex items-start">
                                <Image
                                    alt="user"
                                    className="mr-2 flex h-8 w-8 rounded-full sm:mr-4"
                                    src="https://dummyimage.com/256x256/363536/ffffff&text=U"
                                    width="48"
                                    height="48"
                                />

                                <div className="flex rounded-b-xl rounded-tr-xl bg-slate-50 p-4 dark:bg-slate-800 sm:max-w-md md:max-w-2xl">
                                    <p dangerouslySetInnerHTML={{ __html: (newChat || chat).htmls[i] }}></p>
                                </div>
                            </div>
                        )}
                        {message.role == 'assistant' && (
                            <div className="flex flex-row-reverse items-start=">
                                <Image
                                    alt="assistant"
                                    className="ml-2 h-8 w-8 rounded-full"
                                    src="https://dummyimage.com/128x128/354ea1/ffffff&text=G"
                                    width="48"
                                    height="48"
                                />
                                <div
                                    className="flex min-h-[85px] rounded-b-xl rounded-tl-xl bg-slate-50 p-4 dark:bg-slate-800 sm:min-h-0 sm:max-w-md md:max-w-2xl"
                                >
                                    <p dangerouslySetInnerHTML={{ __html: (newChat || chat).htmls[i] }}></p>
                                </div>
                                <div
                                    className="mr-2 mt-1 flex flex-col-reverse gap-2 text-slate-500 sm:flex-row"
                                >
                                    <button className="hover:text-blue-600" onClick={(e) => handleCopy(message.content)}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            viewBox="0 0 24 24"
                                            stroke-width="2"
                                            stroke="currentColor"
                                            fill="none"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        >
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                            <path
                                            d="M8 8m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z"
                                            ></path>
                                            <path
                                            d="M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2"
                                            ></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}
                        </div>
                    )
                })}
            </div>

            {/* Prompt message input */}
            <form action={formAction}
                className="flex w-full items-center rounded-b-md border-t border-slate-300 bg-slate-200 p-2 dark:border-slate-700 dark:bg-slate-900"
            >
                <div className="w-full">
                    {(newChat || chat).messages.length == 0 && matches.map((match, i) => {
                        const m = match.replaceAll("{", '').replaceAll("}", '')
                        return (
                            <div key={i}
                                className="rounded-lg rounded-b-none border border-slate-300 bg-slate-50 px-2 py-2 dark:border-slate-700 dark:bg-slate-800"
                                >
                                <label htmlFor={m} className="sr-only">{m}</label>
                                <textarea
                                    id={m}
                                    name={m}
                                    rows={2}
                                    className="w-full border-0 bg-slate-50 px-0 text-base text-slate-900 focus:outline-none dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-400"
                                    placeholder={m}
                                    required
                                ></textarea>
                            </div>
                        )
                    })}
                    <div
                        className="rounded-lg rounded-b-none border border-slate-300 bg-slate-50 px-2 py-2 dark:border-slate-700 dark:bg-slate-800"
                        >
                        <label htmlFor="content" className="sr-only">提示词</label>
                        <textarea
                            id="content"
                            name="content"
                            rows={2}
                            className="w-full border-0 bg-slate-50 px-0 text-base text-slate-900 focus:outline-none dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-400"
                            placeholder="提示词"
                            required
                        ></textarea>
                    </div>

                    <div className="ml-2 flex items-center py-2">
                        <div>
                            <button
                            type="submit"
                            className="inline-flex items-center gap-x-2 rounded-lg bg-blue-600 px-4 py-2.5 text-center text-base font-medium text-slate-50 hover:bg-blue-800 focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900"
                            >
                                {isPending ? "发送中..." : "发送"}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    viewBox="0 0 24 24"
                                    strokeWidth="2"
                                    stroke="currentColor"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                    <path d="M10 14l11 -11"></path>
                                    <path
                                    d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5"
                                    ></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </form>

            <div className="border-t border-gray-200">
                <dl>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">
                            Api 链接
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-3">
                            <input type="text" defaultValue={chat.base_url} onChange={(e) => changeBaseUrl(e)} id="base_url" name="base_url" className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" required />
                        </dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">
                            Api Key
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-3">
                            <input type="password" defaultValue={chat.api_key} onChange={(e) => changeApiKey(e)} id="api_key" name="api_key" className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" required />
                        </dd>
                    </div>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">
                            模型名
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-3">
                            <input type="text" defaultValue={chat.model} onChange={(e) => changeModel(e)} id="model" name="model" className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" required />
                        </dd>
                    </div>
                </dl>
            </div>
        </div>
    )
}