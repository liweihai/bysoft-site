'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'

import { formatDate } from '@/utils/datetime'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import {Prompt} from '@/lib/definitions'
import siteMetadata from '@/data/siteMetadata'
import Search from "@/components/Search"
import Pagination from '@/components/Pagination';

export default function List({
  prompts,
  title,
  offset,
  total
}) {
    return (
        <>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              <div className="space-y-2 pt-6 pb-8 md:space-y-5">
                <h1 className="text-3xl lg:text-4xl text-center mb-6 tracking-wider">
                  {title}
                </h1>
                <div className="align-middle rounded-tl-lg rounded-tr-lg inline-block w-full py-4 overflow-hidden bg-white">
                    <div className="flex justify-between">
                        <Search placeholder="搜索提示词..." />
                        <div> </div>
                    </div>
                </div>
              </div>
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {!prompts.length && '没有找到。'}
                {prompts.map((post) => {
                  const { id, create_time, title, remark, category, keywords } = post
                  return (
                    <li key={id} className="py-12">
                      <article>
                        <div className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
                          <dl>
                            <dt className="sr-only">发表时间</dt>
                            <dd className="text-base leading-6 font-medium text-gray-500 dark:text-gray-400">
                              <time dateTime={create_time}>{formatDate(create_time, siteMetadata.locale)}</time>
                            </dd>
                          </dl>
                          <div className="space-y-5 xl:col-span-3">
                            <div className="space-y-6">
                              <div>
                                <h2 className="text-2xl leading-8 font-bold tracking-tight">
                                  <Link
                                    href={`/prompt/${id}`}
                                    className="text-gray-900 dark:text-gray-100 block text-xl"
                                  >
                                    {title}
                                  </Link>
                                </h2>
                                <div className="flex flex-wrap">
                                  {(keywords ? keywords : '').split(",").map((tag) => (
                                    <Tag key={tag} text={tag} />
                                  ))}
                                </div>
                              </div>
                              <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                                {remark}
                              </div>
                            </div>
                            <div className="text-base leading-6 font-medium">
                              <Link
                                href={`/prompt/${id}`}
                                className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                                aria-label={`Read more: "${title}"`}
                              >
                                阅读全部内容 &rarr;
                              </Link>
                            </div>
                          </div>
                        </div>
                      </article>
                    </li>
                  )
                })}
              </ul>
            </div>

            <Pagination url='/prompt?page=' limit={10} offset={offset} total={total} length={prompts.length} />
        </>
    )
}