import { getCloudflareContext } from "@opennextjs/cloudflare";
import { CredentialsSignin } from 'next-auth';
import { Account, ServerError } from "./definitions";

export async function login(username: String, password: String): Promise<Account> {
    const response = await callApi("/account/login", { username: username, password: password });
    const account : Account | ServerError = await response.json();

    if ("token" in account) {
        return account
    }

    throw new CredentialsSignin()
}

export async function findModels<T>(modelName: String, conditions = {}, filter = {}): Promise<T[]> {
    const response = await callApi("/select/" + modelName, {conditions: conditions || {}, filter: filter || {}});

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
    const response = await callApi("/select/" + modelName, {conditions: {id: id}, filter: {limit: 1, offset: 0}});

    try {
        const models: T[] =  await response.json();

        return models[0]
    } catch (err) {
        console.error(err)

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

export async function callApi(path: string, data: {}): Promise<Response> {
    const { env, cf, ctx } = await getCloudflareContext({async: true});

    const utf8Array = new TextEncoder().encode(JSON.stringify(data))
    const options = {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0'
        },
        body: utf8Array
    };
    
    const url = env.API_HOST + "/test" + path + "?_code=" + env.API_CODE ;
    
    return await fetch(url, options);
}