import { genPageMetadata } from '@/app/seo'
import {findModels, countModels} from "@/lib/data"
import {Blog} from "@/lib/definitions"
import List from '@/components/blog/List'

const POSTS_PER_PAGE = 20

export const metadata = genPageMetadata({ title: '文章' })

export default async function BlogPage(props: { searchParams: Promise<{ page: string }> }) {
  const blogs = await findModels<Blog>("Article", POSTS_PER_PAGE, 0, {state: 1})
  const totalBlogs = await countModels("Article", {state: 1})
  
  const pageNumber = 1
  const totalPages = Math.ceil(totalBlogs / POSTS_PER_PAGE)

  const pagination = {
    currentPage: pageNumber,
    totalPages: totalPages,
  }

  return (
    <List
      posts={blogs}
      initialDisplayPosts={blogs}
      pagination={pagination}
      title="所有文章"
    />
  )
}