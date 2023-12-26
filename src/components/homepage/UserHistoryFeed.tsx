import { INFINITE_SCROLL_PAGINATION_RESULTS } from '@/config'
import { db } from '@/lib/db'
import PostFeed from '../PostFeed'

const UserHistoryFeed = async (username: any) => {
  const posts = await db.post.findMany({
    where: {
      author: { username: username.user},
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      votes: true,
      author: true,
      comments: true,
    },
    take: INFINITE_SCROLL_PAGINATION_RESULTS,
  })

  return <PostFeed initialPosts={posts} region={username.user} regionType={'USER'}/>
}

export default UserHistoryFeed
