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

              <div className="sm:flex-1 sm:flex sm:items-center sm:justify-between mt-4 work-sans">
                <div>
                  <p className="text-sm leading-5 text-blue-700">
                      显示
                      <span className="font-medium"> { offset } </span>
                      到
                      <span className="font-medium"> { configs.length + offset} </span>
                      共
                      <span className="font-medium"> { total } </span>
                      结果
                  </p>
                </div>
                <div>
                    <nav className="relative z-0 inline-flex shadow-sm">
                      {page > 1 && (
                        <div>
                            <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-500 hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500 transition ease-in-out duration-150" aria-label="Previous">
                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                                </svg>
                            </a>
                        </div>
                      )}
                        <div>
                          {function() {
                            let pages = []
                            for (let i = 1; i < totalPages; i++){
                              pages.push(<a href="#" className="-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm leading-5 font-medium text-blue-700 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-tertiary active:text-gray-700 transition ease-in-out duration-150 hover:bg-tertiary">{i}</a>)
                            }
                            return pages
                          }()
                          }
                        </div>
                        {page < totalPages && (
                        <div>
                            <a href="#" className="-ml-px relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-500 hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500 transition ease-in-out duration-150" aria-label="Next">
                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                                </svg>
                            </a>
                        </div>
                        )}
                    </nav>
                </div>
              </div>
          </div>
      </div>
  )
}