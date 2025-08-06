import Link from 'next/link';
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'
import {getModel} from "@/lib/data"
import {Prompt} from "@/lib/definitions"
import { formatDate } from '@/utils/datetime'
import { remark } from 'remark';
import html from 'remark-html';
import CopyButton from '@/components/CopyButton'
import { Button } from "@/components/ui/button"
import Tag from '@/components/Tag'

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata | undefined> {
    const params = await props.params
    const slug = params.slug
    const prompt = await getModel<Prompt>("Article", slug)

    return {
        title: prompt.title,
        description: prompt.remark,
    }
}

export default async function Page(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params
    const slug = params.slug

    const prompt = await getModel<Prompt>("Article", slug)

    const chatHref = "/prompt/" + slug + "/chat"

    let contentHtml = prompt.content;
    if (prompt.content_type == 1) {
        const processedContent = await remark().use(html).process(prompt.content);
        contentHtml = processedContent.toString();
    }

    const regexp  = /{{.+}}/g
    let matches = contentHtml.match(regexp)
    if (matches) {
        for(var i = 0; i < matches.length; i++) {
            var match = matches[i].replaceAll("{{", "").replaceAll("}}", "")
            contentHtml = contentHtml.replaceAll(matches[i], "<var>" + match + "</var>")
        }
    }

    const keywords = prompt.keywords ? prompt.keywords.split(",") : []
    
    return (
        <section className="mx-auto max-w-4xl px-4 sm:px-6 xl:max-w-5xl xl:px-0">
            <article className="divide-y divide-gray-200 xl:col-span-3 xl:row-span-2 xl:pb-0 dark:divide-gray-700 pb-6">
                <div>
                    <header>
                        <div className="space-y-1 pb-10 text-center">
                            <div>
                                <h1 className="text-3xl lg:text-4xl text-center mb-6 tracking-wider">
                                    {prompt.title}
                                </h1>
                            </div>
                            <dl>
                                <div>
                                    <dt className="sr-only">发表时间</dt>
                                    <dd className="tracking-wide text-sm mb-6 leading-relaxed mx-auto max-w-xl text-center">
                                        <time dateTime={prompt.create_time}>{formatDate(prompt.create_time, siteMetadata.locale)}</time>
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </header>
                    <div className="divide-y divide-gray-200 pb-8 xl:divide-y-0 dark:divide-gray-700">
                        <div className="prompt-content divide-y divide-gray-200 xl:pb-0 dark:divide-gray-700">
                            <div dangerouslySetInnerHTML={{ __html: contentHtml }} className="tracking-wide prose text-gray-600 leading-loose mx-auto text-left"></div>
                        </div>

                        <footer>
                            <div className="flex flex-col text-sm font-medium sm:flex-row sm:justify-between sm:text-base">
                                <div className="divide-gray-200 text-sm leading-5 font-medium xl:col-start-1 xl:row-start-2 xl:divide-y dark:divide-gray-700">
                                    <div className="py-4 xl:py-8">
                                        <h2 className="text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">标签</h2>
                                        <div className="flex flex-wrap">
                                        {keywords.map((keyword) => {
                                            const url = "/tag/" + keyword.trim()
                                            return (
                                                <Tag key={keyword} text={keyword} />
                                            )
                                        })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </footer>
                    </div>
                </div>
            </article>

            <div className="align-middle rounded-tl-lg rounded-tr-lg inline-block w-full py-4 overflow-hidden bg-white px-12">
                <div className="flex justify-between">
                    <div>  </div>
                    <div>
                        <CopyButton text={prompt.content} />
                        <Button className="ml-2" asChild><Link href={chatHref}>试用</Link></Button>
                    </div>
                </div>
            </div>
        </section>
    )
}