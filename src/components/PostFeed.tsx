'use client'

import { INFINITE_SCROLL_PAGINATION_RESULTS } from '@/config'
import { ExtendedPost } from '@/types/db'
import { useIntersection } from '@mantine/hooks'
import { useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { FC, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Post from './Post'
import { useSession } from 'next-auth/react'
import { RegionType } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'

interface PostFeedProps {
  initialPosts: ExtendedPost[]
  region?: string,
  regionType?: RegionType,
  latitude?: Decimal,
  longitude?: Decimal,
  radius?: number,
  radiusUnits?: string
}

const PostFeed: FC<PostFeedProps> = ({ initialPosts, region, regionType, latitude, longitude, radius, radiusUnits }) => {
  const query = useRouter()

  useEffect(() => {
        
  }, [query])


  const lastPostRef = useRef<HTMLElement>(null)
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  })
  const { data: session } = useSession()

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ['infinite-query'],
    async ({ pageParam = 1 }) => {
      const query =
        `/api/posts?limit=${INFINITE_SCROLL_PAGINATION_RESULTS}&page=${pageParam}` +
        (!!region ? `&region=${region}` : '') + (!!regionType && !!region ? `&regionType=${regionType}` : '') + (!!regionType && !!region && !!latitude ? `&latitude=${latitude}` : '') +
        (!!regionType && !!region && !!longitude ? `&longitude=${longitude}` : '') + (!!regionType && !!region && !!longitude && !!latitude && !!radius ? `&radius=${radius}` : '') +
        (!!regionType && !!region && !!longitude && !!latitude && !!radiusUnits ? `&radiusUnits=${radiusUnits}` : '')

      const { data } = await axios.get(query)
      return data as ExtendedPost[]
    },

    {
      getNextPageParam: (_, pages) => {
        return pages.length + 1
      },
      initialData: { pages: [initialPosts], pageParams: [1] },
    }
  )

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage() // Load more posts when the last post comes into view
    }
  }, [entry, fetchNextPage])

  const posts = data?.pages.flatMap((page) => page) ?? initialPosts

  return (
    <ul className='flex flex-col col-span-2 space-y-6'>
      {posts.length === 0 && region === 'CUSTOM FEED' ? "No posts on your feed yet. Subscribe to regions with existing posts." : null}
      {posts.length === 0 && region != 'CUSTOM FEED' && region != 'GENERAL FEED' ? "This region does not contain any posts yet. Be the first to post for here!" : null}
      {posts.length === 0 && region === 'GENERAL FEED' ? "No posts have been made yet. Be the first to post a listing!" : null}
      {posts.map((post, index) => {
        const votesAmt = post.votes.reduce((acc, vote) => {
          if (vote.type === 'UP') return acc + 1
          if (vote.type === 'DOWN') return acc - 1
          return acc
        }, 0)

        const currentVote = post.votes.find(
          (vote) => vote.userId === session?.user.id
        )

        if (index === posts.length - 1) {
          // Add a ref to the last post in the list
          return (
            <li key={post.id} ref={ref}>
              <Post
                post={post}
                commentAmt={post.comments.length}
                votesAmt={votesAmt}
                currentVote={currentVote}
              />
            </li>
          )
        } else {
          return (
            <Post
              key={post.id}
              post={post}
              commentAmt={post.comments.length}
              votesAmt={votesAmt}
              currentVote={currentVote}
            />
          )
        }
      })}

      {isFetchingNextPage && (
        <li className='flex justify-center'>
          <Loader2 className='w-6 h-6 text-zinc-500 animate-spin' />
        </li>
      )}
    </ul>
  )
}

export default PostFeed
