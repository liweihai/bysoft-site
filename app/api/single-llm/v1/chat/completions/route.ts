import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

import {handleOptions} from "@/lib/options"

import {findModels, getModel, updateModel} from "@/lib/data"
import {ApiKey, QuotaGroup, Quota, Endpoint} from "@/lib/definitions"

export async function POST(request: NextRequest) {
    const authorizations = (request.headers.get("Authorization") || '').split(" ")

    if (authorizations.length < 2) {
        return new Response("请注册并创建Api Key", {status: 400});
    }
        
    const apiKey = authorizations[authorizations.length - 1]

    const url = new URL(request.url);
    const newBody = await request.json();

    const groupName = newBody["model"]

    const key = await getModel<ApiKey>("ApiKey", apiKey.replace("BS-", ""))

    let quotaGroups = []
    if (key) {
        //使用模型组Api Key访问
        quotaGroups = await findModels<QuotaGroup>("QuotaGroup", {customer_id: key.customer_id, name: groupName}, {limit: 1})
    } else {
        //使用自带各个模型的Api Key访问
        quotaGroups = await findModels<QuotaGroup>("QuotaGroup", {customer_id: '1827e53ba48811e8ae8900163e1aebd1', name: groupName}, {limit: 1})
    }

    if (quotaGroups.length == 0) {
        return new Response(groupName + "模型不存在", {status: 500});
    }

    const quotas = await findModels<Quota>("Quota", {quota_group_id: quotaGroups[0].id}, {order: "priority ASC"})

    for(var i = 0; i < quotas.length; i++) {
        const quota = quotas[i]

        const endpoint = await getModel<Endpoint>("Endpoint", quota.endpoint_id)

        if (key) {
            //检查免费配额是否已经用完了
            if ((endpoint.rpm_threshold > 0 && quota.rpm >= endpoint.rpm_threshold)
                || (endpoint.rpd_threshold > 0 && quota.rpd >= endpoint.rpd_threshold)
                || (endpoint.tpm_threshold > 0 && quota.tpm >= endpoint.tpm_threshold)
                || (endpoint.tpd_threshold > 0 && quota.tpd >= endpoint.tpd_threshold)
                || (endpoint.free_tokens > 0 && quota.tokens_used >= endpoint.free_tokens * 1000000)
            ) {
                continue;
            }
        }

        const targetUrl = new URL(endpoint.base_url);
        targetUrl.pathname += "/chat/completions";
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

        if (key) {
            cleanedHeaders.set("Authorization", "Bearer: " + quota.api_key)
        } else {
            var apiKeys = apiKey.split(",")
            if (i < apiKeys.length && apiKeys[i]){
                cleanedHeaders.set("Authorization", "Bearer: " + apiKeys[i])
            } else {
                continue;
            }
        }

        newBody["model"] = endpoint.model

        const utf8Array = new TextEncoder().encode(JSON.stringify(newBody))
        cleanedHeaders.set("content-length", '' + utf8Array.length)

        if (utf8Array.length > endpoint.context_window * 1000) {
            continue
        }

        const modifiedRequest = new NextRequest(targetUrl.toString(), {
            method: "POST",
            headers: cleanedHeaders,
            body: utf8Array,
            redirect: 'follow'
        });

        console.log(targetUrl.toString())

        // Forward the request to the appropriate LLM API
        try {
            const response = await fetch(modifiedRequest);

            const responseBody = await response.text()

            if (response.ok) {
                const responseJson = JSON.parse(responseBody)
                responseJson.model = groupName

                if (key) {
                    //一个 api_key 的额度是通常共享的
                    var joins = {
                        "Endpoint": {
                            "conditions": {
                                "provider": endpoint.provider
                            },
                            "attr": ['id', 'endpoint_id']
                        }
                    }
                    const allQuotas = await findModels<Quota>("Quota", {api_key: quota.api_key}, {}, joins)
                    for(var i = 0; i < allQuotas.length; i++) {
                        try {
                            const newQuota = allQuotas[i]
                            newQuota.rpm += 1
                            newQuota.rpd += 1
                            newQuota.tpm += responseJson.usage.total_tokens
                            newQuota.tpd += responseJson.usage.total_tokens
                            newQuota.requests_used += 1
                            newQuota.tokens_used += responseJson.usage.total_tokens
                            await updateModel<Quota>("Quota", newQuota.id, newQuota)
                        } catch(err) {
                            console.error(err)
                        }
                    }
                }

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
                console.error(targetUrl.toString() + ' failed', newBody, responseBody);
            }
        } catch (error) {
            console.error(targetUrl.toString() + ' failed', error, newBody);
        }
    }

    return new Response('系统错误', { status: 500 });
}

export async function OPTIONS(request: NextRequest) {
    return handleOptions(request)
}
