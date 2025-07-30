import Link from 'next/link';
import { Metadata } from 'next'

import { findModels} from "@/lib/data"
import {Endpoint, Quota} from "@/lib/definitions"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export async function generateMetadata(): Promise<Metadata | undefined> {
    return {
        title: "Single LLM",
        description: "兼容 Open Api 的大模型访问 Api。依次访问下列多个大模型，如果成功则返回成功结果，如果失败继续尝试下一个大模型，直到所有大模型都返回失败。",
    }
}

export default async function EndpointPage() {
    const quotas = await findModels<Quota>("Quota", {quota_group_id: 'G38i97eeKG2KgpxW-nvf_'}, {order: 'priority ASC'})

    const endpoints = await findModels<Endpoint>("Endpoint")

    return (
        <div className="rounded-2xl bg-white px-5 pb-5 pt-5 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
            <div className="space-y-2 pt-6 pb-8 md:space-y-5">
                <h1 className="text-3xl lg:text-4xl text-center mb-6 tracking-wider">
                Single LLM
                </h1>
            </div>
            <dl>
                <div>
                    <dd className="tracking-wide text-sm mb-6 leading-relaxed mx-auto max-w-xl text-center">
                        兼容 Open Api 的大模型访问 Api。依次访问下列多个大模型，如果成功则返回成功结果，如果失败继续尝试下一个大模型，直到所有大模型都返回失败。
                    </dd>
                </div>
            </dl>

            <div className="align-middle inline-block min-w-full overflow-hidden bg-white pt-3 rounded-bl-lg rounded-br-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>供应商</TableHead>
                            <TableHead>模型编码</TableHead>
                            <TableHead>RPM</TableHead>
                            <TableHead>RPD</TableHead>
                            <TableHead>TPM</TableHead>
                            <TableHead>TPD</TableHead>
                            <TableHead>赠送令牌</TableHead>
                            <TableHead className="text-right"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                    {quotas.map((quota) => {
                        const endpoint = endpoints.find(function(e){ return e.id == quota.endpoint_id})                   
                        return (
                            <TableRow key={endpoint.id}>
                                <TableCell><Link target="_blank" href={endpoint.site_url} className="text-sm leading-5 text-blue-900">{ endpoint.provider }</Link></TableCell>
                                <TableCell>{endpoint.model}</TableCell>
                                <TableCell>{ endpoint.rpm_threshold > 0 ? endpoint.rpm_threshold : '无限制' }</TableCell>
                                <TableCell>{ endpoint.rpd_threshold > 0 ? endpoint.rpd_threshold : '无限制' } </TableCell>
                                <TableCell>{ endpoint.tpm_threshold > 0 ? endpoint.tpm_threshold : '无限制' } </TableCell>
                                <TableCell>{ endpoint.tpd_threshold > 0 ? endpoint.tpd_threshold : '无限制' }</TableCell>
                                <TableCell>{ endpoint.free_tokens}</TableCell>
                                <TableCell className="text-right">
                                    <Button asChild><Link href={ endpoint.site_url }>申请</Link></Button>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                    </TableBody>
                </Table>
            </div>

            <div className="bg-white m-auto my-10 shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Single LLM Api（兼容 Open Api）
                    </h3>
                </div>
                <div className="border-t border-gray-200">
                    <dl>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                链接
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                https://www.bysoft.site/api/single-llm/v1
                            </dd>
                        </div>
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                Api Key
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                上列免费大模型的 Api Key，用,分割，不使用某个大模型则直接用，。
                            </dd>
                        </div>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                模型编码
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                free-text-model
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    )
}