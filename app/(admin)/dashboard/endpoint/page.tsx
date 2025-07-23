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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

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
                <div className="sm:flex-1 sm:flex sm:items-center sm:justify-between mt-4 work-sans">
                    <div>
                        <p className="text-sm leading-5">
                            显示
                            <span className="font-medium"> { offset } </span>
                            到
                            <span className="font-medium"> { endpoints.length + offset} </span>
                            共
                            <span className="font-medium"> { total } </span>
                            结果
                        </p>
                    </div>
                    <div>
                        <nav className="relative z-0 inline-flex shadow-sm">
                            <Pagination>
                                <PaginationContent>
                                    {page > 1 && (
                                    <PaginationItem>
                                        <PaginationPrevious href={'/dashboard/endpoint?page=' + (page - 1)} />
                                    </PaginationItem>
                                    )}
                                    {function() {
                                        let pages = []
                                        for (let i = 1; i <= totalPages; i++){
                                            const href = '/dashboard/endpoint?page=' + i;
                                            if (i == page) {
                                                pages.push(<PaginationItem><PaginationLink isActive href={href}>{i}</PaginationLink></PaginationItem>)
                                            } else {
                                                pages.push(<PaginationItem><PaginationLink href={href}>{i}</PaginationLink></PaginationItem>)
                                            }
                                        }
                                        return pages
                                        }()
                                    }
                                    {page < totalPages && (
                                    <PaginationItem>
                                        <PaginationNext href={'/dashboard/endpoint?page=' + (page + 1)} />
                                    </PaginationItem>
                                    )}
                                </PaginationContent>
                            </Pagination>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    )
}