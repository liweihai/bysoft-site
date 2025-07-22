import Link from 'next/link';

import {countModels, findModels} from "@/lib/data"
import {QuotaGroup} from "@/lib/definitions"
import { auth } from '@/auth';
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
import {formatDate} from '@/utils/datetime'

export default async function QuotaGroupPage() {
    const session = await auth()

    const conditions = {customer_id: session.user.id}
    const quotaGroups = await findModels<QuotaGroup>("QuotaGroup", conditions, {})

    return (
        <div className="rounded-2xl bg-white px-5 pb-5 pt-5 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
            <div className="align-middle rounded-tl-lg rounded-tr-lg inline-block w-full py-4 overflow-hidden bg-white px-12">
                <div className="flex justify-between">
                    <div> </div>
                    
                    <Button asChild><Link href="/dashboard/quotagroup/create">创建模型组</Link></Button>
               </div>
            </div>
            <div className="align-middle inline-block min-w-full overflow-hidden bg-white p-8 pt-3 rounded-bl-lg rounded-br-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>名称</TableHead>
                            <TableHead>算法</TableHead>
                            <TableHead>创建时间</TableHead>
                            <TableHead>上次修改</TableHead>
                            <TableHead className="text-right"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                    {quotaGroups.map((quotagroup) => {
                        const href = "/dashboard/quotagroup/edit/" + quotagroup.id
                        const hrefOfView = "/dashboard/quotagroup/view/" + quotagroup.id
                        return (
                            <TableRow key={quotagroup.id}>
                                <TableCell className="font-medium">{ quotagroup.name }</TableCell>
                                <TableCell>{quotagroup.algorithm}</TableCell>
                                <TableCell>{formatDate(quotagroup.create_time)}</TableCell>
                                <TableCell>{formatDate(quotagroup.update_time)}</TableCell>
                                <TableCell className="text-right">
                                    <Button asChild variant="secondary"><Link href={ hrefOfView }>查看</Link></Button>
                                    <Button asChild><Link href={ href }>修改</Link></Button>
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