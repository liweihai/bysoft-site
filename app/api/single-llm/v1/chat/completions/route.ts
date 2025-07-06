import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

import llmEndpoints from "@/data/llmEndpoints"
import {handleOptions} from "@/lib/options"

export async function POST(request: NextRequest) {
    const { env, cf, ctx } = await getCloudflareContext({async: true});

    if (request.headers.get("Authorization") != ("Bearer " + env.API_CODE)) {
        return new Response("没有权限", {status: 400});
    }

    const url = new URL(request.url);
    const newBody = await request.json();

    for(var i = 0; i < llmEndpoints.length; i++) {
        const llmEndpoint = llmEndpoints[i]

        const targetUrl = new URL(llmEndpoint.base_url);
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

        cleanedHeaders.set("Authorization", "Bearer: " + llmEndpoint.api_key)

        const oldModel = newBody["model"]
        newBody["model"] = llmEndpoint.model

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
                responseJson.model = oldModel

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
                console.error(`Error proxying request to ${llmEndpoint.api_type}:`);
            }
        } catch (error) {
            console.error(`Error proxying request to ${llmEndpoint.api_type}:`, error);
        }
    }

    return new Response('系统错误', { status: 500 });
}

export async function OPTIONS(request: NextRequest) {
    return handleOptions(request)
}
