import UserHistoryFeed from '@/components/homepage/UserHistoryFeed'
import { Button, buttonVariants } from '@/components/ui/Button'
import { getAuthSession } from '@/lib/auth'
import { History } from 'lucide-react'
import { notFound } from 'next/navigation'
import SubscribeLeaveToggle from '@/components/SubscribeLeaveToggle'
import { db } from '@/lib/db'
import Link from 'next/link'
import { RegionType } from '@prisma/client'
import RegionFeed from '@/components/homepage/RegionFeed'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

interface LocationProps {
  params: {
    location: string
    regionType: RegionType
  }
}

export default async function Location({ params }: LocationProps) {
  const session = await getAuthSession()
//   const usernameUserId = await db.user.findFirst({
//     where: {
//       location: params.location
//     }
//   })

//   if (!usernameUserId) return notFound()

  const subscription = !session?.user
    ? undefined
    : await db.subscription.findFirst({
        where: {
          region: params.location,
          regionType: params.regionType,
          user: {
            id: session.user.id,
          },
        },
      })

  const isSubscribed = !!subscription

  // if (!subscription) return notFound()

  return (
    <>
      <h1 className='font-bold text-3xl md:text-4xl'>Region Search</h1>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6'>
        {/* @ts-expect-error server component */}
        <RegionFeed location={params.location} regionType={params.regionType} radius={5} radiusUnits={'km'}/>
        
        {session ?
          <div className='overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last'>
            <div className='bg-emerald-100 px-6 py-4'>
              <p className='font-semibold py-3 flex items-center gap-1.5'>
                <History className='h-4 w-4' />
                Your Post History
              </p>
            </div>
            <dl className='-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6'>
              <div className='flex justify-between gap-x-4 py-3'>
                <p className='text-zinc-500'>
                  Here are your prior posts. Come here to check in with your
                  past posts.
                </p>
              </div>

              <Link
                className={buttonVariants({
                  className: 'w-full mt-4 mb-6',
                })}
                href={`/post/submit`}>
                Create Post
              </Link>
            </dl>
          </div>
        : 
        <div className='overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last'>
        <div className='bg-emerald-100 px-6 py-4'>
          <p className='font-semibold py-3 flex items-center gap-1.5'>
            <History className='h-4 w-4' />
            u/{params.location}&apos;s Post History
          </p>
        </div>
        <dl className='-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6'>
          <div className='flex justify-between gap-x-4 py-3'>
            <p className='text-zinc-500'>
              Here are u/{params.location}&apos;s prior posts. Come here to check in with their
              past posts.
            </p>
          </div>
          {/* <SubscribeLeaveToggle
              isSubscribed={isSubscribed}
              region={params.username}
              regionType={RegionType.USER}
              radius={0}
              radiusUnits='miles'
            /> */}

          <Link
            className={buttonVariants({
              className: 'w-full mt-4 mb-6',
            })}
            href={`/post/submit`}>
            Create Post
          </Link>
        </dl>
      </div>
        }
      </div>
    </>
  )
}
