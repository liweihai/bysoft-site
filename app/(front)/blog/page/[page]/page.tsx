import { notFound } from 'next/navigation'

import List from '@/components/blog/List'
import {findModels} from "@/lib/data"
import {Blog} from "@/lib/definitions"

const POSTS_PER_PAGE = 20

export default async function Page(props: { params: Promise<{ page: string }> }) {
  const params = await props.params
  const posts  = await findModels<Blog>("Blog", 1000)
  const pageNumber = parseInt(params.page as string)
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)

  console.log(pageNumber)

  // Return 404 for invalid page numbers or empty pages
  if (pageNumber <= 0 || pageNumber > totalPages || isNaN(pageNumber)) {
    return notFound()
  }
  const initialDisplayPosts = posts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  )
  const pagination = {
    currentPage: pageNumber,
    totalPages: totalPages,
  }

  return (
    <List
      posts={posts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title="所有博文"
    />
  )
}