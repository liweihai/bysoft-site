import Link from 'next/link';

import {countModels, findModels} from "@/lib/data"
import {Endpoint} from "@/lib/definitions"
import Search from "@/components/Search"
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
import Pagination from '@/components/dashboard/Pagination';

export default async function EndpointPage(props: { searchParams?: Promise<{query?: string; page?: string;}>}) {
    const params = await props.searchParams;

    const query = params?.query || '';
    const page = Number(params?.page) || 1;

    const conditions = {}
    if (query) {
        conditions["title"] = {$regex: query}
    }

    const total = await countModels("Endpoint", conditions)

    const offset = (page - 1) * 20;
    const endpoints = await findModels<Endpoint>("Endpoint", conditions, {limit: 20, offset: (page - 1) * 20})

    const totalPages = Math.ceil(total / 20)

    return (
        <div className="rounded-2xl bg-white px-5 pb-5 pt-5 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
            <div className="align-middle rounded-tl-lg rounded-tr-lg inline-block w-full py-4 overflow-hidden bg-white px-12">
                <div className="flex justify-between">
                    <Search placeholder="搜索大模型..." />
                    <Button asChild><Link href="/dashboard/endpoint/create">创建大模型</Link></Button>
                </div>
            </div>
            <div className="align-middle inline-block min-w-full overflow-hidden bg-white p-8 pt-3 rounded-bl-lg rounded-br-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>供应商</TableHead>
                            <TableHead>大模型</TableHead>
                            <TableHead>RPM</TableHead>
                            <TableHead>RPD</TableHead>
                            <TableHead>TPM</TableHead>
                            <TableHead>TPD</TableHead>
                            <TableHead>赠送令牌</TableHead>
                            <TableHead className="text-right"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                    {endpoints.map((endpoint) => {
                        const href = "/dashboard/endpoint/edit/" + endpoint.id                        
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
                                    <Button asChild><Link href={ href }>修改</Link></Button>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                    </TableBody>
                </Table>
                <Pagination model="endpoint" limit={10} offset={offset} total={total} length={endpoints.length} />
            </div>
        </div>
    )
}