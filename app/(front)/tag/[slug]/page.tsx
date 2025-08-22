import { Metadata } from 'next'

import List from '@/components/prompt/List'
import {findModels, countModels} from "@/lib/data"
import {Prompt} from "@/lib/definitions"

const POSTS_PER_PAGE = 10

export async function generateMetadata(props: { params: Promise<{ slug: string }>, searchParams?: Promise<{query?: string; page?: string;}>}): Promise<Metadata | undefined> {
    const params = await props.params
    const tag = decodeURIComponent(params.slug)

    const searchParams = await props.searchParams
    const query = searchParams?.query || '';

    return {
        title: query + "-" + tag + "提示词",
        description: "内容中有关键词" + query + "的全部" + tag + "提示词",
    }
}

export default async function TagPage(props: { params: Promise<{ slug: string }>, searchParams?: Promise<{query?: string; page?: string;}>}) {
    const searchParams = await props.searchParams
    const page = Number(searchParams?.page) || 1;

    const params = await props.params
    const tag = decodeURIComponent(params.slug)

    const query = searchParams?.query || '';
    const conditions = {"state": 1, category: '提示语', "keywords": {"$regex": tag}}
    if (query) {
        conditions["$or"] = [
            {
              "title": {$regex: query}
            },
            {
              "content": {$regex: query}
            }
        ]
    }

    const totalPrompts = await countModels("Article", conditions)
    const prompts = await findModels<Prompt>("Article", conditions, {limit: POSTS_PER_PAGE, offset: POSTS_PER_PAGE *(page - 1), select: 'id, title, keywords, remark, create_time, state, category', order: 'create_time DESC'})

    return (
      <List
        prompts={prompts}
        offset={(page - 1) * POSTS_PER_PAGE}
        total={totalPrompts}
        title={tag + '提示词'}
      />
    )
}