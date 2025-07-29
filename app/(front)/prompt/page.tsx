import { notFound } from 'next/navigation'
import { Metadata } from 'next'

import List from '@/components/prompt/List'
import {findModels, countModels} from "@/lib/data"
import {Prompt} from "@/lib/definitions"

const POSTS_PER_PAGE = 10

export async function generateMetadata(): Promise<Metadata | undefined> {
    return {
        title: "全部提示词",
        description: "全部提示词",
    }
}

export default async function Page(props: { searchParams: Promise<{ page?: string }> }) {
    const params = await props.searchParams
    const page = Number(params?.page) || 1;

    const blogs = await findModels<Prompt>("Article", {state: 1, category: '提示语'}, {select: 'id, title, keywords, remark, create_time', limit: POSTS_PER_PAGE, offset: (page - 1) * POSTS_PER_PAGE, order: 'create_time DESC'})
    const totalPrompts = await countModels("Article", {state: 1, category: '提示语'})

    const totalPages = Math.ceil(totalPrompts / POSTS_PER_PAGE)

    const pagination = {
      currentPage: page,
      totalPages: totalPages,
    }

    return (
        <List
          posts={blogs}
          pagination={pagination}
          title="所有提示词"
        />
    )
}