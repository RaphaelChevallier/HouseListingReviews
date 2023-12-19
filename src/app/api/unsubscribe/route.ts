import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { RegionType } from '@prisma/client'
import { z } from 'zod'

export async function POST(req: Request) {
  try {
    const session = await getAuthSession()

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    let { region, regionType, radius, radiusUnits } = body

    if(regionType === RegionType.USER){
      const usernameUserId = await db.user.findFirst({
        where: {
          username: region
        }
      })
      region = usernameUserId?.id
    }

    // check if user has already subscribed to
    const subscriptionExists = await db.subscription.findFirst({
      where: {
        userId: session.user.id,
        region: region,
        regionType: regionType,
      },
    })

    if (!subscriptionExists) {
      return new Response(
        "You've not been subscribed to this subreddit, yet.",
        {
          status: 400,
        }
      )
    }

    await db.subscription.delete({
      where: {
        userId: session.user.id,
        region,
        regionType: regionType,
      },
    })

    return new Response('Unsubscribed!',
    { status: 200 })
  } catch (error) {
    (error)
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 })
    }

    return new Response(
      'Could not unsubscribe at this time. Please try later',
      { status: 500 }
    )
  }
}
