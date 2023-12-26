import { INFINITE_SCROLL_PAGINATION_RESULTS } from '@/config'
import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import PostFeed from '../PostFeed'
import { notFound } from 'next/navigation'

const CustomFeed = async () => {
  const session = await getAuthSession()

  // only rendered if session exists, so this will not happen
  if (!session) return notFound()

  const posts = await db.post.findAllSubPosts(
    session.user.id
  )

  return <PostFeed initialPosts={posts} region={'CUSTOM FEED'}/>
}

export default CustomFeed
