import { getCloudflareContext } from "@opennextjs/cloudflare";

import { Account } from "./definitions";

export async function login(username: String, password: String): Promise<Account> {
    const { env, cf, ctx } = await getCloudflareContext({async: true});

    const url = env.API_HOST + "/test/account/login?_code=" + env.API_CODE ;
    const options = {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0'
        },
        body: JSON.stringify({ username: username, password: password })
    };
    const response = await fetch(url, options);
    const account: Account = await response.json();

    return account
}

export async function findModels<T>(modelName: String, limit:Number): Promise<T[]> {
    const { env, cf, ctx } = await getCloudflareContext({async: true});

    const url = env.API_HOST + "/test/select/" + modelName + "?_code=" + env.API_CODE + "&limit=" + limit;
    const response = await fetch(url, {headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0'
    }});

    try {
        const blogs: T[] =  await response.json();

        return blogs
    } catch (err) {
        return []
    }
}

export async function getModel<T>(modelName: String, id:String): Promise<T> {
    const { env, cf, ctx } = await getCloudflareContext({async: true});

    const url = env.API_HOST + "/test/select/" + modelName + "?_code=" + env.API_CODE + "&id=" + id;
    const response = await fetch(url, {headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0'
    }});

    try {
        const blogs: T[] =  await response.json();

        return blogs[0]
    } catch (err) {
        return null
    }
}
