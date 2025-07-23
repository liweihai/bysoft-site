import Link from 'next/link';

import {countModels, findModels, getModel} from "@/lib/data"
import {Prompt, Customer} from "@/lib/definitions"
import Search from "@/components/Search"
import {formatDate} from '@/utils/datetime'
import {auth} from '@/auth';
import EditStateForm from '@/components/prompt/EditStateForm';
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

export default async function PromptPage(props: { searchParams?: Promise<{query?: string; page?: string;}>}) {
    const params = await props.searchParams;

    const session = await auth()
    const customer = await getModel<Customer>("Customer", session.user.id)

    const query = params?.query || '';
    const page = Number(params?.page) || 1;
    
    const conditions = {category: '提示语'}
    if (customer.role == 0) {
        conditions['customer_id'] = customer.id
    }
    if (query) {
        conditions["title"] = {$regex: query}
    }

    const total = await countModels("Article", conditions)

    const offset = (page - 1) * 10;
    const prompts = await findModels<Prompt>("Article", conditions, {order: 'state ASC, create_time DESC', limit: 10, offset: (page - 1) * 10})

    const totalPages = Math.ceil(total / 10)

    return (
        <div className="rounded-2xl bg-white px-5 pb-5 pt-5 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
            <div className="align-middle rounded-tl-lg rounded-tr-lg inline-block w-full py-4 overflow-hidden bg-white px-12">
                <div className="flex justify-between">
                    <Search placeholder="搜索提示词..." />
                    <Button><Link href="/dashboard/prompt/create">新建提示词</Link></Button>
                </div>
            </div>
            <div className="align-middle inline-block min-w-full overflow-hidden bg-white p-8 pt-3 rounded-bl-lg rounded-br-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>标题</TableHead>
                            <TableHead>标签</TableHead>
                            <TableHead>摘要</TableHead>
                            <TableHead>创建时间</TableHead>
                            <TableHead className="text-right"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                    {prompts.map((prompt) => {
                        const href = "/dashboard/prompt/edit/" + prompt.id                        
                        return (
                            <TableRow key={prompt.id}>
                                <TableCell>{ prompt.title }</TableCell>
                                <TableCell>{prompt.keywords}</TableCell>
                                <TableCell className="whitespace-normal">{prompt.remark}</TableCell>
                                <TableCell>{formatDate(prompt.create_time)}</TableCell>
                                <TableCell className="text-right">
                                    {customer.role == 1 && (
                                        <EditStateForm obj={prompt} />
                                    )}
                                    <Button><Link href={ href }>修改</Link></Button>
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
                            <span className="font-medium"> { prompts.length + offset} </span>
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
                                        <PaginationPrevious href={'/dashboard/prompt?page=' + (page - 1)} />
                                    </PaginationItem>
                                    )}
                                    {function() {
                                        let pages = []
                                        for (let i = 1; i <= totalPages; i++){
                                            const href = '/dashboard/prompt?page=' + i;
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
                                        <PaginationNext href={'/dashboard/prompt?page=' + (page + 1)} />
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