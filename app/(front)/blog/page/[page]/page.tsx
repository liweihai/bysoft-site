import { notFound } from 'next/navigation'

import List from '@/components/blog/List'
import {findModels, countModels} from "@/lib/data"
import {Blog} from "@/lib/definitions"

const POSTS_PER_PAGE = 20

export default async function Page(props: { params: Promise<{ page: string }> }) {
  const params = await props.params
  const pageNumber = parseInt(params.page as string)

  const blogs = await findModels<Blog>("Article", POSTS_PER_PAGE, 0, {state: 1})
  const totalBlogs = await countModels("Article", {state: 1})

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
      initialDisplayPosts={blogs}
      pagination={pagination}
      title="所有博文"
    />
  )
}