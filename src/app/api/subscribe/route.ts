import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { RadiusUnits, RegionType } from '@prisma/client'
import { z } from 'zod'
import { Prisma } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'

export async function POST(req: Request) {
  try {
    const session = await getAuthSession()

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 })
    }

    const body = await req.json()
  
    let { region, regionType, radius, radiusUnits, coordinates } : {region: string, regionType: RegionType, radius: Decimal, radiusUnits: RadiusUnits, coordinates: Array<number>} = body


    if(regionType === RegionType.USER){
      const usernameUserId = await db.user.findFirst({
        where: {
          username: region
        }
      })
      region = usernameUserId?.id || ''
    }
    // check if user has already subscribed to
    const subscriptionExists = await db.subscription.findFirst({
      where: {
        userId: session.user.id,
        region: region,
        regionType: regionType,
        // radius: radius,
        // radiusUnits: radiusUnits,
      },
    })


    if((subscriptionExists?.radius && subscriptionExists?.radius != radius) ||(subscriptionExists?.radiusUnits && subscriptionExists?.radiusUnits != radiusUnits)){
      // create and delete and associate it with the user
      await db.subscription.deleteMany({
        where: {
          userId: session.user.id,
          region,
          regionType: regionType,
        },
      })

      await db.subscription.create({
        data: {
          userId: session.user.id,
          region: region,
          regionType: regionType,
          radius: new Prisma.Decimal(radius),
          radiusUnits: radiusUnits,
          coordinates: coordinates
        },
      })
      return new Response(`We changed your current subscription to ${region} with Radius: ${subscriptionExists?.radius} ${subscriptionExists?.radiusUnits} to
      Radius: ${radius} ${radiusUnits}`, {
        status: 200,
      })
    }
    if (subscriptionExists) {
      return new Response("You've already subscribed to this", {
        status: 400,
      })
    }

    // create subreddit and associate it with the user
    const newSub = await db.subscription.create({
      data: {
        userId: session.user.id,
        region: region,
        regionType: regionType,
        radius: new Prisma.Decimal(radius),
        radiusUnits: radiusUnits,
        coordinates: coordinates
      },
    })

    return new Response('Subscribed!',
    { status: 200 })
  } catch (error) {
    (error)
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 })
    }

    return new Response(
      'Could not subscribe at this time. Please try later',
      { status: 500 }
    )
  }
}
