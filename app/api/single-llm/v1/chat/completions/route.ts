import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

import {handleOptions} from "@/lib/options"

import {findModels, getModel} from "@/lib/data"
import {ApiKey, QuotaGroup, Quota, Endpoint} from "@/lib/definitions"

export async function POST(request: NextRequest) {
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

    const url = new URL(request.url);
    const newBody = await request.json();

    const groupName = newBody["model"]
    const quotaGroups = await findModels<QuotaGroup>("QuotaGroup", {name: groupName}, {limit: 1})

    if (quotaGroups.length == 0) {
        return new Response("模型不存在", {status: 500});
    }

    const quotas = await findModels<Quota>("Quota", {quota_group_id: quotaGroups[0].id}, {order: "priority ASC"})

    for(var i = 0; i < quotas.length; i++) {
        const quota = quotas[i]

        const endpoint = await getModel<Endpoint>("Endpoint", quota.endpoint_id)

        const targetUrl = new URL(endpoint.base_url);
        targetUrl.pathname = "/chat/completions";
        targetUrl.search = url.search;

        const cleanedHeaders = new Headers();
        for (const [key, value] of request.headers) {
            // Skip Cloudflare-specific headers and other headers we want to clean
            if (!key.toLowerCase().startsWith('cf-') && 
                !['x-real-ip', 'x-forwarded-for', 'x-forwarded-proto', 
                  'x-forwarded-host', 'x-forwarded-port', 'x-forwarded-scheme',
                  'x-forwarded-ssl', 'cdn-loop'].includes(key.toLowerCase())) {
                cleanedHeaders.set(key, value);
            }
        }

        cleanedHeaders.set("Authorization", "Bearer: " + quota.api_key)

        newBody["model"] = endpoint.model

        const utf8Array = new TextEncoder().encode(JSON.stringify(newBody))
        cleanedHeaders.set("content-length", '' + utf8Array.length)

        const modifiedRequest = new NextRequest(targetUrl.toString(), {
            method: "POST",
            headers: cleanedHeaders,
            body: utf8Array,
            redirect: 'follow'
        });

        // Forward the request to the appropriate LLM API
        try {
            const response = await fetch(modifiedRequest);

            const resopnseBody = await response.text()

            if (response.ok) {
                const responseJson = JSON.parse(resopnseBody)
                responseJson.model = groupName

                const utf8Array = new TextEncoder().encode(JSON.stringify(responseJson))

                const cleanedHeaders = new Headers();
                for (const [key, value] of request.headers) {
                    cleanedHeaders.set(key, value);
                }

                cleanedHeaders.set("content-length", '' + utf8Array.length)
                // Create a new response with CORS headers
                const modifiedResponse = new Response(utf8Array, {
                    status: response.status,
                    statusText: response.statusText,
                    headers: cleanedHeaders
                });
                
                // Add CORS headers
                modifiedResponse.headers.set('Access-Control-Allow-Origin', request.headers.get('Origin') || '*');
                modifiedResponse.headers.set('Access-Control-Allow-Credentials', 'true');
                
                return modifiedResponse;
            } else {
                console.error(`Error proxying request to ${endpoint.model}:`);
            }
        } catch (error) {
            console.error(`Error proxying request to ${endpoint.model}:`, error);
        }
    }

    return new Response('系统错误', { status: 500 });
}

export async function OPTIONS(request: NextRequest) {
    return handleOptions(request)
}
