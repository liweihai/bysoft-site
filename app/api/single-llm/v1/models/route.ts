import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

import {handleOptions} from "@/lib/options"

export async function GET(request: NextRequest) {
    const { env, cf, ctx } = await getCloudflareContext({async: true});

    const authorizations = request.headers.get("Authorization").split(" ")

    if (authorizations.length < 2) {
        return new Response("没有权限", {status: 400});
    }
        
    const apiCode = authorizations[authorizations.length - 1]

    const models = {
        object: "list",
        data: [{
            id: "retry-one-by-one-on-error",
            object: "model",
            created: 1686935002,
            owned_by: "bysoft.net.cn"
        }]
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
