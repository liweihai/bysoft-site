import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

import {handleOptions} from "@/lib/options"

import {findModels} from "@/lib/data"
import {ApiKey, QuotaGroup} from "@/lib/definitions"

export async function GET(request: NextRequest) {
    const { env, cf, ctx } = await getCloudflareContext({async: true});

    const authorizations = (request.headers.get("Authorization") || '').split(" ")

    if (authorizations.length < 2) {
        return new Response("没有权限", {status: 400});
    }
        
    const apiKey = authorizations[authorizations.length - 1]

    const keys = await findModels<ApiKey>("ApiKey", {api_key: apiKey}, {limit: 1})
    if (keys.length == 0) {
        return new Response("请注册并创建Api Key", {status: 400});
    }

    const quotaGroups = await findModels<QuotaGroup>("QuotaGroup", {customer_id: keys[0].customer_id})

    const models = {
        object: "list",
        data: []
    }

    for(var i = 0; i < quotaGroups.length; i++) {
        models.data.push({
            id: quotaGroups[i].name,
            object: "model",
            owned_by: "bysoft"
        })
    }

    const utf8Array = new TextEncoder().encode(JSON.stringify(models))

    const cleanedHeaders = new Headers();
    for (const [key, value] of request.headers) {
        cleanedHeaders.set(key, value);
    }

    cleanedHeaders.set("content-length", '' + utf8Array.length)

    return new Response(utf8Array,{
        status: 200,
        statusText: "ok",
        headers: cleanedHeaders
    });
}
