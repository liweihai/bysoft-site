import { notFound } from 'next/navigation'
import { Metadata } from 'next'

import List from '@/components/prompt/List'
import {findModels, countModels} from "@/lib/data"
import {Prompt} from "@/lib/definitions"

const POSTS_PER_PAGE = 20

export async function generateMetadata(props: { params: Promise<{ slug: string }>}): Promise<Metadata | undefined> {
    const params = await props.params
    const tag = decodeURIComponent(params.slug)

    return {
        title: tag + "提示词",
        description: tag + "提示词",
    }
}

export default async function TagPage(props: { params: Promise<{ slug: string }>, searchParams?: Promise<{page?: string;}>}) {
    const searchParams = await props.searchParams
    const page = Number(searchParams?.page) || 1;

    const params = await props.params
    const tag = decodeURIComponent(params.slug)

    const conditions = {"state": 1, category: '提示语', "keywords": {"$regex": tag}}

    const totalPrompts = await countModels("Article", conditions)
    const totalPages = Math.ceil(totalPrompts / POSTS_PER_PAGE)

    const blogs = await findModels<Prompt>("Article", conditions, {limit: POSTS_PER_PAGE, offset: POSTS_PER_PAGE *(page - 1), order: 'create_time DESC'})

    const pagination = {
      currentPage: page,
      totalPages: totalPages,
    }

    return (
      <List
        posts={blogs}
        pagination={pagination}
        title={tag}
      />
    )
}