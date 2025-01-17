'use client'

import { formatTimeToNow } from '@/lib/utils'
import { Post, User, Vote } from '@prisma/client'
import { MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { FC, useRef } from 'react'
import EditorOutput from './EditorOutput'
import PostVoteClient from './post-vote/PostVoteClient'

type PartialVote = Pick<Vote, 'type'>

interface PostProps {
  post: Post & {
    author: User
    votes: Vote[]
  }
  votesAmt: number
  currentVote?: PartialVote
  commentAmt: number
}

const Post: FC<PostProps> = ({
  post,
  votesAmt: _votesAmt,
  currentVote: _currentVote,
  commentAmt,
}) => {
  const pRef = useRef<HTMLParagraphElement>(null)

  return (
    <div className='rounded-md bg-white shadow'>
    <a href={`/post/${post.id}`}>

      <div className='px-6 py-4 flex justify-between'>
        <PostVoteClient
          postId={post.id}
          initialVotesAmt={_votesAmt}
          initialVote={_currentVote?.type}
        />

        <div className='w-0 flex-1'>
          <div className='max-h-40 mt-1 text-xs text-gray-500'>
            <span>Posted by u/<Link className='hover:underline' href={`/u/${post.author.username}`}>{post.author.username}</Link></span>{' '}
            {formatTimeToNow(new Date(post.createdAt))}
          </div>
            <h1 className='text-2xl font-semibold py-2 leading-6 text-gray-900'>
              {post.title}
            </h1>
          
          <h3 className='text-sm py-2 leading-6'>
            <Link className='text-blue-600 dark:text-blue-500 hover:underline' target='_blank' href={post.listingUrl?? ''}>{post.listingUrl}</Link>
          </h3>
          <h3 className={post.content ? 'text-md py-2 leading-6 border-b mb-4' : 'text-md py-2 leading-6'}>
          <Link className='text-blue-600 dark:text-blue-500 hover:underline' target='_blank' href={`https://www.google.com/maps/place/${post.address}`}>{post.address}</Link>
          </h3>

          <div
            className='relative text-sm max-h-40 w-full overflow-clip'
            ref={pRef}>
            <EditorOutput content={post.content} />
            {pRef.current?.clientHeight === 160 ? (
              // blur bottom if content is too long
              <div className='absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent'></div>
            ) : null}
          </div>
        </div>
      </div>
      </a>

      <div className='bg-gray-50 z-20 text-sm px-4 py-4 sm:px-6'>
        <Link
          href={`/post/${post.id}`}
          className='w-fit flex items-center gap-2'>
          <MessageSquare className='h-4 w-4' /> {commentAmt} comments
        </Link>
      </div>
    </div>
  )
}
export default Post
