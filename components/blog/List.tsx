'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'

import { formatDate } from '@/utils/datetime'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import {Blog} from '@/lib/definitions'
import siteMetadata from '@/data/siteMetadata'

interface PaginationProps {
  totalPages: number
  currentPage: number
}

interface ListLayoutProps {
  posts: Blog[]
  title: string
  initialDisplayPosts?: Blog[]
  pagination?: PaginationProps
}

function Pagination({ totalPages, currentPage }: PaginationProps) {
    const pathname = usePathname()
    const segments = pathname.split('/')
    const lastSegment = segments[segments.length - 1]
    const basePath = pathname
      .replace(/^\//, '') // Remove leading slash
      .replace(/\/page\/\d+\/?$/, '') // Remove any trailing /page
      .replace(/\/$/, '') // Remove trailing slash
    const prevPage = currentPage - 1 > 0
    const nextPage = currentPage + 1 <= totalPages

    return (
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <nav className="flex justify-between">
            {!prevPage && (
              <button className="cursor-auto disabled:opacity-50" disabled={!prevPage}>
                上一页
              </button>
            )}
            {prevPage && (
              <Link
                href={currentPage - 1 === 1 ? `/${basePath}/` : `/${basePath}/page/${currentPage - 1}`}
                rel="prev"
              >
                上一页
              </Link>
            )}
            <span>
              {currentPage} / {totalPages}
            </span>
            {!nextPage && (
              <button className="cursor-auto disabled:opacity-50" disabled={!nextPage}>
                下一页
              </button>
            )}
            {nextPage && (
              <Link href={`/${basePath}/page/${currentPage + 1}`} rel="next">
                下一页
              </Link>
            )}
          </nav>
        </div>
    )
}

export default function List({
  posts,
  title,
  pagination,
}: ListLayoutProps) {
    return (
      <>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          <div className="space-y-2 pt-6 pb-8 md:space-y-5">
            <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
              {title}
            </h1>
          </div>
          <ul>
            {!posts.length && '没有找到。'}
            {posts.map((post) => {
              const { id, create_time, title, remark, keywords } = post
              return (
                <li key={id} className="py-4">
                  <article className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
                    <dl>
                      <dt className="sr-only">Published on</dt>
                      <dd className="text-base leading-6 font-medium text-gray-500 dark:text-gray-400">
                        <time dateTime={create_time}>{formatDate(create_time, siteMetadata.locale)}</time>
                      </dd>
                    </dl>
                    <div className="space-y-3 xl:col-span-3">
                      <div>
                        <h3 className="text-2xl leading-8 font-bold tracking-tight">
                          <Link href={`/blog/${id}`} className="text-gray-900 dark:text-gray-100">
                            {title}
                          </Link>
                        </h3>
                        <div className="flex flex-wrap">
                          {(keywords? keywords.split(","): []).map((tag) => <Tag key={tag} text={tag} />)}
                        </div>
                      </div>
                      <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                        {remark}
                      </div>
                    </div>
                  </article>
                </li>
              )
            })}
          </ul>
        </div>
        {pagination && pagination.totalPages > 1 && (
          <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
        )}
      </>
    )
}