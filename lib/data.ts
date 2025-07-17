import { getCloudflareContext } from "@opennextjs/cloudflare";
import { CredentialsSignin } from 'next-auth';
import { Account, ServerError, Prompt, ChatMessage } from "./definitions";

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

export async function chatWith(history: [], chat: {}): Promise<ChatMessage[]> {
    const messages = [];

    for(var i = 0; i < history.length; i++) {
        messages.push(history[i])
    }

    try {
        let baseUrl  = ""
        let apiKey   = ""
        let model    = ""
        let promptId = null
        let keyVals  = {}
        let content = ""
        Object.keys(chat).forEach(function(key) {
            if (key == 'model') {
                model = chat[key]
            } else if (key == "prompt_id") {
                promptId = chat[key]
            } else if (key == "api_key") {
                apiKey = chat[key]
            } else if (key == "base_url") {
                baseUrl = chat[key]
            } else if (key == "content") {
                content = chat[key]
            } else {
                keyVals[key] = chat[key]
            }
        })

        if (history.length == 0) {
            const prompt = await getModel<Prompt>("Article", promptId)
            content = prompt.content
            Object.keys(keyVals).forEach(function(k) {
                content = content.replaceAll("{{" + k + "}}", keyVals[k])
            })
        }

        messages.push({
            role: "user",
            content: content
        })

        const body = {
            model: model,
            messages: messages
        }

        const utf8Array = new TextEncoder().encode(JSON.stringify(body))

        const options = {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0',
                'Authorization': 'Bearer ' + apiKey
            },
            body: utf8Array,
        cache: <RequestCache><any>'no-cache'
        };
        
        const timestamp = Date.now();
        const response = await fetch(baseUrl + "/chat/completions?t=" + timestamp, options);

        if (!response.ok) {
            const error : ServerError = await response.json();
            console.error('Error response:', error);

            messages.push({
                role: 'assistant',
                content: error.toString()
            })
            return messages
        }

        const obj = await response.json()

        messages.push(obj["choices"][0].message)
        return messages
    } catch(error) {
        console.error('Error response message:', error);

        messages.push({
            role: 'assistant',
            content: error.toString()
        })

        return messages
    }
}

