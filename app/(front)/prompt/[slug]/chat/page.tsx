import {getModel, findModels} from "@/lib/data"
import {Prompt, ApiKey} from "@/lib/definitions"
import ChatForm from '@/components/prompt/ChatForm';
import { Suspense } from 'react'
import {auth} from '@/auth';

async function ChatPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params
    const slug = params.slug

    const prompt = await getModel<Prompt>("Article", slug)

    const session = await auth()

    if (session.user) {
        var apikeys = await findModels<ApiKey>("ApiKey", {customer_id: session.user.id}, {limit: 1})
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
                <ChatForm obj={prompt} base_url="https://www.bysoft.site/api/single-llm/v1" model="free-text-model" api_key={session.user ? apikeys[0].id: ''} />
            </Suspense>
        </div>
    )
}

export default ChatPage