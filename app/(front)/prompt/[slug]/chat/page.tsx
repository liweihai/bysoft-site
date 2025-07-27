import {getModel, findModels} from "@/lib/data"
import {Prompt, ApiKey} from "@/lib/definitions"
import ChatForm from '@/components/prompt/ChatForm';
import { Suspense } from 'react'
import {auth} from '@/auth';
import { Chat } from "@/lib/definitions";
import { headers } from "next/headers";
import { Metadata } from 'next'

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata | undefined> {
    const params = await props.params
    const slug = params.slug
    const prompt = await getModel<Prompt>("Article", slug)

    return {
        title: "试用" + prompt.title,
        description: "试用" + prompt.remark,
    }
}

async function ChatPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params
    const slug = params.slug

    const prompt = await getModel<Prompt>("Article", slug)

    const session = await auth()

    const chat = {} as Chat;
    chat.prompt_id = prompt.id
    chat.base_url  = "https://www.bysoft.site/api/single-llm/v1"
    chat.model     = "free-text-model"
    chat.messages  = []
    chat.api_key   = ""
    chat.headers   = await headers()

    if (session) {
        var apiKeys = await findModels<ApiKey>("ApiKey", {customer_id: session.user.id}, {limit: 1})
        if (apiKeys.length > 0) {
            chat.api_key = apiKeys[0].id
        }
    }

    return (
        <div className="mx-auto p-4">
            <header>
                <div className="space-y-1 pb-10 text-center">
                    <div>
                        <h1 className="text-3xl lg:text-4xl text-center mb-6 tracking-wider">
                            {prompt.title}
                        </h1>
                    </div>
                </div>
            </header>
            <Suspense>
                <ChatForm obj={prompt} chatInit={chat} />
            </Suspense>
        </div>
    )
}

export default ChatPage