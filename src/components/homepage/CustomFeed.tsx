import { INFINITE_SCROLL_PAGINATION_RESULTS } from '@/config'
import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import PostFeed from '../PostFeed'
import { notFound } from 'next/navigation'

const CustomFeed = async () => {
  const session = await getAuthSession()

  // only rendered if session exists, so this will not happen
  if (!session) return notFound()

  const followedCommunities = await db.subscription.findMany({
    where: {
      userId: session.user.id,
    },
  })

  const posts = await db.post.findMany({
    where: {
      country:{
        in: followedCommunities.filter(x=> x.regionType === 'COUNTRY').map(sub => (sub.region)),
      },
      city: {
          in: followedCommunities.filter(x=> x.regionType === 'CITY').map(sub => (sub.region)),
      },
      county: {
        in: followedCommunities.filter(x=> x.regionType === 'COUNTY').map(sub => (sub.region)),
      },
      postalCode: {
        in: followedCommunities.filter(x=> x.regionType === 'ZIP').map(sub => (sub.region)),
      },
      stateOrProvince: {
        in: followedCommunities.filter(x=> x.regionType === 'STATE').map(sub => (sub.region))
      },
      authorId: {
        in: followedCommunities.filter(x=> x.regionType === 'USER').map(sub => (sub.region))
      }
    },
    distinct: ['id'],
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

  return <PostFeed initialPosts={posts} />
}

export default CustomFeed
