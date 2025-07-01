import { notFound } from 'next/navigation'

import List from '@/components/blog/List'
import {findModels, countModels} from "@/lib/data"
import {Blog} from "@/lib/definitions"

const POSTS_PER_PAGE = 20

export default async function Page(props: { params: Promise<{ slug: string, page: string }> }) {
  const params = await props.params
  const pageNumber = parseInt(params.page as string)

  const category = decodeURIComponent(params.slug)

  const blogs = await findModels<Blog>("Article", {state: 1, category: category}, {limit: POSTS_PER_PAGE, offset: (pageNumber - 1) * POSTS_PER_PAGE})
  const totalBlogs = await countModels("Article", {state: 1, keywords: category})

  const totalPages = Math.ceil(totalBlogs / POSTS_PER_PAGE)

  // Return 404 for invalid page numbers or empty pages
  if (pageNumber <= 0 || pageNumber > totalPages || isNaN(pageNumber)) {
    return notFound()
  }

  const pagination = {
    currentPage: pageNumber,
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