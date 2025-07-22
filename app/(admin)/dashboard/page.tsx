import Link from 'next/link';

import {countModels, findModels} from "@/lib/data"
import {ApiKey} from "@/lib/definitions"
import {auth} from '@/auth';
import {formatDate} from '@/utils/datetime'
import {createApiKey} from "@/lib/actions";
import EditForm from '@/components/apikey/EditForm';
import DelForm from '@/components/DelForm';
import CopyButton from '@/components/CopyButton';

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

export default async function ApiKeyPage() {
    const session = await auth()

    const conditions = {customer_id: session.user.id}
    const apiKeys = await findModels<ApiKey>("ApiKey", conditions, {})

    const mask = (cc, num = 4, mask = "*") =>
        `${cc}`.slice(-num).padStart(`${cc}`.length, mask);

    return (
        <div className="rounded-2xl bg-white px-5 pb-5 pt-5 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
            <div className="align-middle rounded-tl-lg rounded-tr-lg inline-block w-full py-4 overflow-hidden bg-white px-12">
                <div className="flex justify-between">
                    <div> </div>
                    <EditForm obj={{customer_id: session.user.id}} />
                </div>
            </div>
            <div className="align-middle inline-block min-w-full overflow-hidden bg-white p-8 pt-3 rounded-bl-lg rounded-br-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>创建时间</TableHead>
                            <TableHead>Api Key</TableHead>
                            <TableHead className="text-right"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {apiKeys.map((apiKey) => (
                        <TableRow key={apiKey.id}>
                            <TableCell className="font-medium">{formatDate(apiKey.create_time)}</TableCell>
                            <TableCell><span className="mr-5">BS-{mask(apiKey.id)}</span> <CopyButton text={'BS-' + apiKey.id} /></TableCell>
                            <TableCell className="text-right">
                                <DelForm obj={{model:"ApiKey", id:apiKey.id}} />
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}