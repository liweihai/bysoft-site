import Link from 'next/link';

import {countModels, findModels, getModel} from "@/lib/data"
import {Prompt, Customer} from "@/lib/definitions"
import Search from "@/components/Search"
import {formatDate} from '@/utils/datetime'
import {auth} from '@/auth';
import EditStateForm from '@/components/prompt/EditStateForm';
import GenerateRemarkForm from '@/components/prompt/GenerateRemarkForm';
import GenerateKeywordsForm from '@/components/prompt/GenerateKeywordsForm';
import Pagination from '@/components/dashboard/Pagination';
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
import DelForm from '@/components/DelForm';

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
    const prompts = await findModels<Prompt>("Article", conditions, {select: 'id, title, keywords, remark, create_time', order: 'state ASC, create_time DESC', limit: 10, offset: (page - 1) * 10})

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
                            <TableRow key={ prompt.id }>
                                <TableCell><Link href={"/prompt/" + prompt.id} target="_blank" >{ prompt.title }</Link></TableCell>
                                <TableCell className="whitespace-normal">{ prompt.keywords }
                                    <div>
                                        <GenerateKeywordsForm obj={prompt} />
                                    </div>
                                </TableCell>
                                <TableCell className="whitespace-normal">{ prompt.remark }
                                    <div>
                                        <GenerateRemarkForm obj={prompt} />
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {formatDate(prompt.create_time)}
                                    <div>
                                        {customer.role == 1 && (
                                            <EditStateForm obj={prompt} />
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div>
                                        <Button><Link href={ href }>修改</Link></Button>
                                    </div>
                                    <div>
                                        <DelForm obj={{model:"Article", id:prompt.id}} />
                                    </div>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                    </TableBody>
                </Table>

                <Pagination model="prompt" limit={10} offset={offset} total={total} length={prompts.length} />
            </div>
        </div>
    )
}