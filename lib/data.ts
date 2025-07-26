import { getCloudflareContext } from "@opennextjs/cloudflare";
import { CredentialsSignin } from 'next-auth';
import { Account, ServerError, Prompt, ApiKey, Chat, ChatMessage } from "./definitions";
import { NextRequest, NextResponse } from "next/server";
import { remark } from 'remark';
import html from 'remark-html';
import {auth} from '@/auth';

export async function login(username: String, password: String): Promise<Account> {
    try {
        const response = await callApi("/account/login", { username: username, password: password });
        const account : Account = await response.json();

        return account
    } catch(err) {
        console.error(err)
        throw new CredentialsSignin()
    }
}

export async function githubLogin(id: String, email: String, name: string, avatar: string): Promise<Account> {
    try {
        const response = await callApi("/account/login/github", { id: id, email: email, name: name, avatar: avatar });
        const account : Account = await response.json();

        return account
    } catch(err) {
        console.error(err)
        throw new CredentialsSignin()
    }
}

export async function findModels<T>(modelName: String, conditions = {}, filters = {}): Promise<T[]> {
    const response = await callApi("/select/" + modelName, {conditions: conditions || {}, filters: filters || {}});

    try {
        const blogs: T[] =  await response.json();

        return blogs
    } catch (err) {
        console.error(err)
        return []
    }
}

export async function countModels(modelName: String, conditions: {}): Promise<number> {
    const response = await callApi("/count/" + modelName, {conditions: conditions || {}});

    try {
        const total =  await response.text();

        return + total
    } catch (err) {
        console.error(err)
        return 0
    }
}

export async function getModel<T>(modelName: String, id:String): Promise<T> {
    if (id) {
        const response = await callApi("/select/" + modelName, {conditions: {id: id}, filters: {limit: 1, offset: 0}});

        try {
            const models: T[] =  await response.json();

            return models[0]
        } catch (err) {
            console.error(err)

            return null
        }
    } else {
        return null
    }
}

export async function createModel<T>(modelName: String, model:T): Promise<T> {
    const response = await callApi("/create/" + modelName, model);

    try {
        const blogs: T[] =  await response.json();

        return blogs[0]
    } catch (err) {
        return null
    }
}

export async function updateModel<T>(modelName: String, id: String, model:T): Promise<T> {
    const response = await callApi("/update/" + modelName + "/" + id, model);

    const newModel: T =  await response.json();

    return newModel
}

export async function deleteModel(modelName: String, id:string) {
    const response = await callApi("/delete/" + modelName + "/" + id, {id: id});

    try {
        const obj =  await response.json();

        return obj
    } catch (err) {
        return null
    }
}

export async function callApi(path: string, data: {}): Promise<Response> {
    const { env, cf, ctx } = await getCloudflareContext({async: true});

    const session = await auth()

    const utf8Array = new TextEncoder().encode(JSON.stringify(data))
    const options = {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0'
        },
        body: utf8Array,
        cache: <RequestCache><any>'no-cache'
    };
    
    let url = env.API_HOST + "/om" + path + "?api_key=" + env.API_CODE
    if (session) {
        url += "&token=" + session["token"] ;
    }
    
    const response = await fetch(url, options);

    if (!response.ok) {
        const error : ServerError = await response.json();
        console.error('Error response:', error);
        throw error
    }

    return response
}

export async function chatWithPrompt(chat: Chat, keyVals: {}): Promise<Chat> {
    const newChat = {} as Chat;

    newChat.prompt_id = chat.prompt_id
    newChat.base_url  = chat.base_url
    newChat.model     = chat.model
    newChat.api_key   = chat.api_key
    newChat.headers   = chat.headers
    newChat.messages  = []
    newChat.htmls     = []
    for(var i = 0; i < chat.messages.length; i++) {
        newChat.messages.push(chat.messages[i])
        newChat.htmls.push(chat.htmls[i])
    }

    try {
        let content = ""

        if (chat.messages.length == 0) {
            const prompt = await getModel<Prompt>("Article", chat.prompt_id)
            content = prompt.content
            Object.keys(keyVals).forEach(function(k) {
                content = content.replaceAll("{{" + k + "}}", keyVals[k])
            })
        } else {
            content = keyVals['content']
        }

        newChat.messages.push({
            role: 'user',
            content: content
        })
        let htmlContent = await remark().use(html).process(content)
        newChat.htmls.push(htmlContent.toString())

        const response = await chatWith(chat.base_url, chat.model, chat.api_key, newChat.messages)

        if (!response.ok) {
            const error = await response.text();
            console.error('Error response:', error);

            newChat.messages.push({
                role: 'assistant',
                content: ""
            })
            newChat.htmls.push(error)
            return newChat
        }

        const obj = await response.json()

        const message = obj["choices"][0].message
        newChat.messages.push(message)

        htmlContent = await remark().use(html).process(message.content)
        newChat.htmls.push(htmlContent.toString())
        return newChat
    } catch(error) {
        console.error('Error response message:', error);

        newChat.messages.push({
            role: 'assistant',
            content: ""
        })
        newChat.htmls.push(error.toString())

        return newChat
    }
}

export async function chatWithQuota(name, content): Promise<string> {
    const session = await auth()

    if (!session.user) {
        throw new Error("请登录")
    }

    var apiKeys = await findModels<ApiKey>("ApiKey", {customer_id: session.user.id}, {limit: 1})
    if (apiKeys.length == 0) {
        throw new Error("请先创建Api Key")
    }

    const messages = [{
        'role': 'user',
        "content": content
    }]

    const env = process.env.NODE_ENV
    if(env == "development") {
        var response = await chatWith("http://localhost:3000/api/single-llm/v1", name, "BS-" + apiKeys[0].id, messages)
    } else {
        var response = await chatWith("https://www.bysoft.site/api/single-llm/v1", name, "BS-" + apiKeys[0].id, messages)
    }
    
    if (response.ok) {
        const obj = await response.json()

        return obj["choices"][0].message.content
    }

    const error = await response.text();
    console.error('Error response:', error);

    throw new Error(error)
}

export async function chatWith(url, model, apiKey, messages): Promise<Response> {
    const body = {
        model: model,
        messages: messages
    }

    const cleanedHeaders = new Headers();

    cleanedHeaders.set("Authorization", "Bearer: " + apiKey)

    const utf8Array = new TextEncoder().encode(JSON.stringify(body))
    cleanedHeaders.set("content-length", '' + utf8Array.length)

    const timestamp = Date.now();
    const modifiedRequest = new NextRequest(url + "/chat/completions?t=" + timestamp, {
        method: "POST",
        headers: cleanedHeaders,
        body: utf8Array,
        redirect: 'follow'
    });

    return await fetch(modifiedRequest);
}

