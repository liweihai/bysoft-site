import { notFound } from 'next/navigation'

import List from '@/components/blog/List'
import {findModels, countModels} from "@/lib/data"
import {Blog} from "@/lib/definitions"

const POSTS_PER_PAGE = 20

export default async function TagPage(props: { params: Promise<{ slug: string }>, searchParams?: Promise<{page?: string;}>}) {
    const searchParams = await props.searchParams
    const page = Number(searchParams?.page) || 1;

    const params = await props.params
    const tag = decodeURIComponent(params.slug)

    const conditions = {"state": 1, "keywords": {"$regex": tag}}

    const totalBlogs = await countModels("Article", conditions)
    const totalPages = Math.ceil(totalBlogs / POSTS_PER_PAGE)

    const blogs = await findModels<Blog>("Article", conditions, {limit: POSTS_PER_PAGE, offset: POSTS_PER_PAGE *(page - 1), order: 'create_time DESC'})

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