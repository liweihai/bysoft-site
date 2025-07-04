import Link from 'next/link';

import {countModels, findModels} from "@/lib/data"
import {Blog} from "@/lib/definitions"
import Search from "@/components/Search"

export default async function BlogPage(props: { searchParams?: Promise<{query?: string; page?: string;}>}) {
    const params = await props.searchParams;

    const query = params?.query || '';
    const page = Number(params?.page) || 1;

    const conditions = {}
    if (query) {
        conditions["title"] = {$regex: query}
    }

    const total = await countModels("Article", conditions)

    const offset = (page - 1) * 20;
    const blogs = await findModels<Blog>("Article", conditions, {limit: 20, offset: (page - 1) * 20})

    const totalPages = Math.ceil(total / 20)

    return (
        <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 pr-10 lg:px-8">
            <div className="align-middle rounded-tl-lg rounded-tr-lg inline-block w-full py-4 overflow-hidden bg-white shadow-lg px-12">
                <div className="flex justify-between">
                    <Search placeholder="搜索文章..." />
                    <button className="mx-5 px-5 py-2 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none"><Link href="/dashboard/blog/create">创建文章</Link></button>
                </div>
            </div>
            <div className="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard p-8 pt-3 rounded-bl-lg rounded-br-lg">
                <table className="min-w-full">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">标题</th>
                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">分类</th>
                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">标签</th>
                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">时间</th>
                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">状态</th>
                            <th className="px-6 py-3 border-b-2 border-gray-300"></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                    {blogs.map((blog) => {
                    const { id, create_time, title, remark, keywords, category, state } = blog
                    const href = "/dashboard/blog/edit/" + id
                    return (
                    <tr key={id}>
                        <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                            <div className="text-sm leading-5 text-blue-900">{ title }</div>
                        </td>
                        <td className="px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">{category}</td>
                        <td className="px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">{keywords}</td>
                        <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500 text-blue-900 text-sm leading-5">{create_time}</td>
                        <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500 text-blue-900 text-sm leading-5">{state == 0 ? '下线' : '上线'}</td>
                        <td className="px-6 py-4 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5">
                            <button className="px-5 py-2 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none"><Link href={ href }>修改</Link></button>
                        </td>
                    </tr>
                    )
                    })}
                    </tbody>
                </table>
                <div className="sm:flex-1 sm:flex sm:items-center sm:justify-between mt-4 work-sans">
                <div>
                    <p className="text-sm leading-5 text-blue-700">
                        显示
                        <span className="font-medium"> { offset } </span>
                        到
                        <span className="font-medium"> { blogs.length + offset} </span>
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