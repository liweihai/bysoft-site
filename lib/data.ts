import { getCloudflareContext } from "@opennextjs/cloudflare";

import { Blog, Account } from "./definitions";

const baseUrl: String = "https://www.emedclub.com/test/"

export async function login(username: String, password: String): Promise<Account> {
    const { env, cf, ctx } = await getCloudflareContext({async: true});

    const url = env.API_HOST + "/test/account/login?_code=" + env.API_CODE + "&username=" + username + "&password=" + password ;
    const response = await fetch(url);
    const account: Account = await response.json();

    return account
}

export async function findBlogs(limit:Number): Promise<Blog[]> {
    const { env, cf, ctx } = await getCloudflareContext({async: true});

    const url = env.API_HOST + "/test/select/Article?_code=" + env.API_CODE + "&limit=" + limit;
    const response = await fetch(url);
    const blogs: Blog[] =  await response.json();

    return blogs
}

export async function getBlog(id:String): Promise<Blog> {
    const { env, cf, ctx } = await getCloudflareContext({async: true});

    const url = env.API_HOST + "/test/select/Article?_code=" + env.API_CODE + "&id=" + id;
    const response = await fetch(url);
    const blogs: Blog[] =  await response.json();
    return blogs[0];
}
