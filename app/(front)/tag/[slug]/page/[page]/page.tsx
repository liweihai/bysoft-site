import { notFound } from 'next/navigation'

import List from '@/components/blog/List'
import {findModels, countModels} from "@/lib/data"
import {Blog} from "@/lib/definitions"

const POSTS_PER_PAGE = 20

export default async function Page(props: { params: Promise<{ slug: string, page: string }> }) {
  const params = await props.params
  const pageNumber = parseInt(params.page as string)
  const tag = decodeURIComponent(params.slug)

  const conditions = {"state": 1, "keywords": {"$regex": tag}}

  const totalBlogs = await countModels("Article", conditions)
  const totalPages = Math.ceil(totalBlogs / POSTS_PER_PAGE)

  // Return 404 for invalid page numbers or empty pages
  if (pageNumber <= 0 || pageNumber > totalPages || isNaN(pageNumber)) {
    return notFound()
  }

  const blogs = await findModels<Blog>("Article", conditions, {limit: POSTS_PER_PAGE, offset: POSTS_PER_PAGE *(pageNumber - 1)})

  const pagination = {
    currentPage: pageNumber,
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