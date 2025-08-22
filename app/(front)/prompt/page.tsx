import { Metadata } from 'next'

import List from '@/components/prompt/List'
import {findModels, countModels} from "@/lib/data"
import {Prompt} from "@/lib/definitions"

const POSTS_PER_PAGE = 10

export async function generateMetadata(props: { searchParams: Promise<{ query: string }> }): Promise<Metadata | undefined> {
    const params = await props.searchParams
    const query = params?.query || '';

    if (query) {
        return {
            title: query + "-全部提示词",
            description: "内容中有关键词" + query + "的全部提示词",
        }
    } else {
        return {
            title: "全部提示词",
            description: "全部提示词",
        }
    }

}

export default async function Page(props: { searchParams: Promise<{ query?: string; page?: string; }> }) {
    const params = await props.searchParams
    const page = Number(params?.page) || 1;

    const query = params?.query || '';
    const conditions = {state: 1, category: '提示语'};
    if (query) {
        conditions["$or"] = [
            {
                "title": {$regex: query}
            },
            {
                "content": {$regex: query}
            }
        ]
    };

    const prompts = await findModels<Prompt>("Article", conditions, {select: 'id, title, keywords, remark, create_time, state, category', limit: POSTS_PER_PAGE, offset: (page - 1) * POSTS_PER_PAGE, order: 'create_time DESC'})
    const totalPrompts = await countModels("Article", conditions);

    return (
        <List
          prompts={prompts}
          title="所有提示词"
          offset={(page - 1) * POSTS_PER_PAGE}
          total={totalPrompts}
        />
    )
}