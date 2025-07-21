import Link from 'next/link';

import {countModels, findModels} from "@/lib/data"
import {Cooperation} from "@/lib/definitions"
import { auth } from '@/auth';
import DelForm from '@/components/DelForm';
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

export default async function CooperationPage() {
    const cooperations = await findModels<Cooperation>("Cooperation", {}, {order: 'create_time DESC'})

    return (
        <div className="rounded-2xl bg-white px-5 pb-5 pt-5 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
            <div className="align-middle inline-block min-w-full overflow-hidden bg-white p-8 pt-3 rounded-bl-lg rounded-br-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>姓名</TableHead>
                            <TableHead>联系方式</TableHead>
                            <TableHead>留言内容</TableHead>
                            <TableHead>留言时间</TableHead>
                            <TableHead className="text-right"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                    {cooperations.map((cooperation) => {                    
                        return (
                            <TableRow key={cooperation.id}>
                                <TableCell>{ cooperation.name }</TableCell>
                                <TableCell>{cooperation.phone}</TableCell>
                                <TableCell>{cooperation.description}</TableCell>
                                <TableCell>{formatDate(cooperation.create_time)}</TableCell>
                                <TableCell className="text-right">
                                    <DelForm obj={{model:"Cooperation", id:cooperation.id, redirect_url:"/dashboard"}} />
                                </TableCell>
                            </TableRow>
                        )
                    })}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}