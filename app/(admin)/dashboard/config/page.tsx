import {countModels, findModels} from "@/lib/data"
import {Config} from "@/lib/definitions"
import Link from 'next/link';
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
import DelForm from '@/components/DelForm';
import Pagination from '@/components/dashboard/Pagination';

export default async function Page(props: { params: Promise<{ page: number }> }) {
  const params = await props.params
  const page = params.page || 1

  const total = await countModels("Config", {})
  const offset = (page - 1) * 20;
  const configs = await findModels<Config>("Config", {}, {limit: 20, offset: offset})

  const totalPages = Math.ceil(total / 20)

  return (
      <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 pr-10 lg:px-8">
          <div className="align-middle rounded-tl-lg rounded-tr-lg inline-block w-full py-4 overflow-hidden bg-white px-12">
              <div className="flex justify-between">
                  <div> </div>
                  <Button asChild><Link href="/dashboard/config/create">创建配置</Link></Button>
              </div>
          </div>
          <div className="align-middle inline-block min-w-full overflow-hidden bg-white p-8 pt-3 rounded-bl-lg rounded-br-lg">
              <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>名称</TableHead>
                            <TableHead>值</TableHead>
                            <TableHead>时间</TableHead>
                            <TableHead className="text-right"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                    {configs.map((config) => {
                        const { id, name, value, create_time } = config
                        const href = "/dashboard/config/edit/" + id                  
                        return (
                            <TableRow key={config.id}>
                                <TableCell>{ config.name }</TableCell>
                                <TableCell>{config.value}</TableCell>
                                <TableCell>{formatDate(config.create_time)}</TableCell>
                                <TableCell className="text-right">
                                    <Button asChild><Link href={ href }>修改</Link></Button>
                                    <DelForm obj={{model:"Config", id:config.id}} />
                                </TableCell>
                            </TableRow>
                        )
                    })}
                    </TableBody>
                </Table>

                <Pagination model="config" limit={10} offset={offset} total={total} length={configs.length} />
            </div>
      </div>
  )
}