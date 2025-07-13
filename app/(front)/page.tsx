import Image from "next/image";

import Link from '@/components/Link'
import Tag from '@/components/Tag'
import {findModels} from "@/lib/data"
import {Blog} from "@/lib/definitions"
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from '@/utils/datetime'

export default async function Home() {
  const blogs = await findModels<Blog>("Article", {state: 1}, {limit: 5, offset: 0, order: 'create_time DESC'})

  return (
      <>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          <div className="space-y-2 pt-6 pb-8 md:space-y-5">
            <h1 className="text-3xl lg:text-4xl text-center mb-6 tracking-wider">
              最新文章
            </h1>
          </div>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {!blogs.length && '暂时没有文章.'}
            {blogs.map((blog) => {
              const { id, create_time, title, remark, keywords } = blog
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
                                href={`/blog/${id}`}
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
                            href={`/blog/${id}`}
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
        {blogs.length == 5 && (
          <div className="flex justify-end text-base leading-6 font-medium">
            <Link
              href="/blog"
              className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
              aria-label="All posts"
            >
              所有文章 &rarr;
            </Link>
          </div>
        )}
    </>
  );
}
