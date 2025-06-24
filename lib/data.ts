import { getCloudflareContext } from "@opennextjs/cloudflare";
import { CredentialsSignin } from 'next-auth';
import { Account, ServerError } from "./definitions";

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
    const account : Account | ServerError = await response.json();

    if ("token" in account) {
        return account
    }

    throw new CredentialsSignin()
}

export async function findModels<T>(modelName: String, limit: Number = 20, offset: Number = 0): Promise<T[]> {
    const { env, cf, ctx } = await getCloudflareContext({async: true});

    const url = env.API_HOST + "/test/select/" + modelName + "?_code=" + env.API_CODE + "&limit=" + limit + "&offset=" + offset;
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

export async function countModels(modelName: String): Promise<number> {
    const { env, cf, ctx } = await getCloudflareContext({async: true});

    const url = env.API_HOST + "/test/count/" + modelName + "?_code=" + env.API_CODE;
    const response = await fetch(url, {headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0'
    }});

    try {
        const total =  await response.text();

        return + total
    } catch (err) {
        return 0
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
