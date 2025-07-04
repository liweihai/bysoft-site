import '@/css/prism.css'

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import siteMetadata from '@/data/siteMetadata'
import {getModel} from "@/lib/data"
import {Blog} from "@/lib/definitions"
import { formatDate } from '@/utils/datetime'

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
    }): Promise<Metadata | undefined> {
    const params = await props.params
    const slug = params.slug
    const post = await getModel<Blog>("Article", slug)

    const publishedAt = new Date(post.create_time).toISOString()
    const modifiedAt = new Date(post.update_time).toISOString()

    let imageList = [siteMetadata.socialBanner]

    return {
        title: post.title,
        description: post.remark,
        openGraph: {
            title: post.title,
            description: post.remark,
            siteName: siteMetadata.title,
            locale: 'zh_CN',
            type: 'article',
            publishedTime: publishedAt,
            modifiedTime: modifiedAt,
            url: './',
            images: imageList
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.remark,
            images: imageList,
        },
    }
}

export default async function Page(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params
    const slug = params.slug

    const post = await getModel<Blog>("Article", slug)

    return (
        <section className="mx-auto max-w-3xl px-4 sm:px-6 xl:max-w-5xl xl:px-0">
            <article>
                <div>
                    <header>
                        <div className="space-y-1 pb-10 text-center">
                            <div>
                                <h1 className="text-3xl lg:text-4xl text-center mb-6 tracking-wider">
                                    {post.title}
                                </h1>
                            </div>
                            <dl>
                                <div>
                                    <dt className="sr-only">发表时间</dt>
                                    <dd className="tracking-wide text-sm mb-6 leading-relaxed mx-auto max-w-xl text-center">
                                        <time dateTime={post.create_time}>{formatDate(post.create_time, siteMetadata.locale)}</time>
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </header>
                    <div className="grid-rows-[auto_1fr] divide-y divide-gray-200 pb-8 xl:divide-y-0 dark:divide-gray-700">
                        <div className="divide-y divide-gray-200 xl:col-span-3 xl:row-span-2 xl:pb-0 dark:divide-gray-700">
                            <div dangerouslySetInnerHTML={{ __html: post.content }} className="tracking-wide text-xs text-gray-600 leading-loose mx-auto max-w-xl text-left"></div>
                        </div>

                        <footer>
                            <div className="flex flex-col text-sm font-medium sm:flex-row sm:justify-between sm:text-base">
                            </div>
                        </footer>
                    </div>
                </div>
            </article>
        </section>
    )
}