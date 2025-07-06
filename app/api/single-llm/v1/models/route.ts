import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

import llmEndpoints from "@/data/llmEndpoints"
import {handleOptions} from "@/lib/options"

export async function GET(request: NextRequest) {
    const { env, cf, ctx } = await getCloudflareContext({async: true});

    if (request.headers.get("Authorization") != ("Bearer " + env.API_CODE)) {
        return new Response("没有权限", {status: 400});
    }
    
    const models = {
        object: "list",
        data: []
    }

    for(var i = 0; i < llmEndpoints.length; i++) {
        models.data.push({
            id: llmEndpoints[i].model,
            object: "model",
            created: 1686935002,
            owned_by: "bysoft.net.cn"
        })
    }

    models.data.push({
        id: "retry-on-error",
        object: "model",
        created: 1686935002,
        owned_by: "bysoft.net.cn"
    })

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
