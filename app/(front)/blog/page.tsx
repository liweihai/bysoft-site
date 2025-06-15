import { genPageMetadata } from '@/app/seo'
import {findModels} from "@/lib/data"
import {Blog} from "@/lib/definitions"
import List from '@/components/blog/List'

const POSTS_PER_PAGE = 20

export const metadata = genPageMetadata({ title: '文章' })

export default async function BlogPage(props: { searchParams: Promise<{ page: string }> }) {
  const posts = await findModels<Blog>("Article", 1000)
  const pageNumber = 1
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
  const initialDisplayPosts = posts.slice(0, POSTS_PER_PAGE * pageNumber)
  const pagination = {
    currentPage: pageNumber,
    totalPages: totalPages,
  }

  return (
    <List
      posts={posts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title="所有文章"
    />
  )
}