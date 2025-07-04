import { notFound } from 'next/navigation'

import List from '@/components/blog/List'
import {findModels, countModels} from "@/lib/data"
import {Blog} from "@/lib/definitions"

const POSTS_PER_PAGE = 20

export default async function CategoryPage(props: { params: Promise<{ slug: string }>, searchParams?: Promise<{page?: string;}>}) {
    const searchParams = await props.searchParams
    const page = Number(searchParams?.page) || 1;

    const params = await props.params
    const category = decodeURIComponent(params.slug)

    const blogs = await findModels<Blog>("Article", {state: 1, category: category}, {limit: POSTS_PER_PAGE, offset: (page - 1) * POSTS_PER_PAGE, order: 'create_time DESC'})
    const totalBlogs = await countModels("Article", {state: 1, category: category})

    const totalPages = Math.ceil(totalBlogs / POSTS_PER_PAGE)

    const pagination = {
        currentPage: page,
        totalPages: totalPages,
    }

    return (
        <List
            posts={blogs}
            pagination={pagination}
            title={category}
        />
    )
}