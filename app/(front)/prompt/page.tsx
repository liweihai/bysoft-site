import { notFound } from 'next/navigation'

import List from '@/components/blog/List'
import {findModels, countModels} from "@/lib/data"
import {Blog} from "@/lib/definitions"

const POSTS_PER_PAGE = 20

export default async function Page(props: { searchParams: Promise<{ page?: string }> }) {
    const params = await props.searchParams
    const page = Number(params?.page) || 1;

    const blogs = await findModels<Blog>("Article", {state: 1, category: '提示语'}, {limit: POSTS_PER_PAGE, offset: (page - 1) * POSTS_PER_PAGE, order: 'create_time DESC'})
    const totalBlogs = await countModels("Article", {state: 1, category: '提示语'})

    const totalPages = Math.ceil(totalBlogs / POSTS_PER_PAGE)

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