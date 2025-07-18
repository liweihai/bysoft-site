import { getCloudflareContext } from "@opennextjs/cloudflare";
import { CredentialsSignin } from 'next-auth';
import { Account, ServerError, Prompt, Chat, ChatMessage } from "./definitions";
import { NextRequest, NextResponse } from "next/server";

export async function login(username: String, password: String): Promise<Account> {
    try {
        const response = await callApi("/account/login", { username: username, password: password });
        const account : Account = await response.json();

        return account
    } catch(err) {
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
    
    const timestamp = Date.now();
    const url = env.API_HOST + "/test" + path + "?_code=" + env.API_CODE + "&t=" + timestamp ;
    
    const response = await fetch(url, options);

    if (!response.ok) {
        const error : ServerError = await response.json();
        console.error('Error response:', error);
        throw error
    }

    return response
}

export async function chatWith(chat: Chat, keyVals: {}): Promise<Chat> {
    const newChat = {} as Chat;

    newChat.prompt_id = chat.prompt_id
    newChat.base_url  = chat.base_url
    newChat.model     = chat.model
    newChat.api_key   = chat.api_key
    newChat.headers   = chat.headers
    newChat.messages  = []
    for(var i = 0; i < chat.messages.length; i++) {
        newChat.messages.push(chat.messages[i])
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

        const body = {
            model: chat.model,
            messages: newChat.messages
        }

        const cleanedHeaders = new Headers();
        for (const [key, value] of chat.headers) {
            // Skip Cloudflare-specific headers and other headers we want to clean
            if (!key.toLowerCase().startsWith('cf-') && 
                !['x-real-ip', 'x-forwarded-for', 'x-forwarded-proto', 
                  'x-forwarded-host', 'x-forwarded-port', 'x-forwarded-scheme',
                  'x-forwarded-ssl', 'cdn-loop'].includes(key.toLowerCase())) {
                cleanedHeaders.set(key, value);
            }
        }

        cleanedHeaders.set("Authorization", "Bearer: " + chat.api_key)

        const utf8Array = new TextEncoder().encode(JSON.stringify(body))
        cleanedHeaders.set("content-length", '' + utf8Array.length)

        const timestamp = Date.now();
        const modifiedRequest = new NextRequest(chat.base_url + "/chat/completions?t=" + timestamp, {
            method: "POST",
            headers: cleanedHeaders,
            body: utf8Array,
            redirect: 'follow'
        });

        const response = await fetch(modifiedRequest);

        if (!response.ok) {
            const error = await response.text();
            console.error('Error response:', error);

            newChat.messages.push({
                role: 'assistant',
                content: error
            })
            return newChat
        }

        const obj = await response.json()

        newChat.messages.push(obj["choices"][0].message)
        return newChat
    } catch(error) {
        console.error('Error response message:', error);

        newChat.messages.push({
            role: 'assistant',
            content: error.toString()
        })

        return newChat
    }
}

