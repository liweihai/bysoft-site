import Link from 'next/link';

import {countModels, findModels} from "@/lib/data"
import {Customer} from "@/lib/definitions"
import { auth } from '@/auth';
import {formatDate} from '@/utils/datetime'
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
import Pagination from '@/components/Pagination';

export default async function CudstomerPage(props: { searchParams?: Promise<{query?: string; page?: string;}>}) {
    const params = await props.searchParams;

    const query = params?.query || '';
    const page = Number(params?.page) || 1;

    const conditions = {}
    if (query) {
        conditions["name"] = {$regex: query}
    }

    const customers = await findModels<Customer>("Customer", conditions, {limit: 20, offset: (page - 1) * 20, order: 'create_time DESC'})
    const total = await countModels("Customer", conditions)

    const offset = (page - 1) * 20;

    return (
        <div className="rounded-2xl bg-white px-5 pb-5 pt-5 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
            <div className="align-middle inline-block min-w-full overflow-hidden bg-white p-8 pt-3 rounded-bl-lg rounded-br-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>姓名</TableHead>
                            <TableHead>联系方式</TableHead>
                            <TableHead>注册时间</TableHead>
                            <TableHead>上次登录</TableHead>
                            <TableHead className="text-right"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                    {customers.map((customer) => {                    
                        return (
                            <TableRow key={customer.id}>
                                <TableCell>{customer.name}</TableCell>
                                <TableCell>{customer.mobile}</TableCell>
                                <TableCell>{formatDate(customer.update_time)}</TableCell>
                                <TableCell>{formatDate(customer.create_time)}</TableCell>
                                <TableCell className="text-right">
                                    <DelForm obj={{model:"Customer", id:customer.id, redirect_url:"/dashboard/customer"}} />
                                </TableCell>
                            </TableRow>
                        )
                    })}
                    </TableBody>
                </Table>
                <Pagination url='/dashboard/customer?page=' limit={10} offset={offset} total={total} length={customers.length} />
            </div>
        </div>
    )
}