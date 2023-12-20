import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'
import { convertToMeters } from '@/components/homepage/RegionFeed'

export async function GET(req: Request) {
  const url = new URL(req.url)

  const session = await getAuthSession()

  let followedCommunitiesIds: string[] = []

  if (session) {
    const subscriptions = await db.subscription.findMany({
      where: {
        userId: session.user.id,
      },
    })

    followedCommunitiesIds = subscriptions.map((sub) => sub.region)
  }

  try {
    const { limit, page, region, regionType, latitude, longitude, radius, radiusUnits } = z
      .object({
        limit: z.string(),
        page: z.string(),
        regionType: z.string().nullish().optional(),
        region: z.string().nullish().optional(),
        latitude: z.any().nullish().optional(),
        longitude: z.any().nullish().optional(),
        radius: z.number().nullish().optional(),
        radiusUnits: z.any().nullish().optional(),
      })
      .parse({
        limit: url.searchParams.get('limit'),
        page: url.searchParams.get('page'),
        region: url.searchParams.get('region'),
        regionType: url.searchParams.get('regionType'),
        latitude: url.searchParams.get('latitude'),
        longitude: url.searchParams.get('longitude'),
        radius: url.searchParams.get('radius'),
        radiusUnits: url.searchParams.get('radiusUnits')
      })

    let whereClause = {}

    if (regionType === "USER") {
      whereClause = {
        regionType: regionType,
        region: region
      }
    } else if ( regionType != "USER" && regionType != null && regionType != undefined ){
      const skip = (parseInt(page) - 1) * parseInt(limit);
      const posts = await db.post.findPointsWithin(
        latitude,
        longitude,
        convertToMeters(radius? radius : 5 , radiusUnits? radiusUnits : "KILOMETERS"),
        skip
      )
      return new Response(JSON.stringify(posts))
    }
    // else if (session) {
    //   whereClause = {
    //     subreddit: {
    //       id: {
    //         in: followedCommunitiesIds,
    //       },
    //     },
    //   }
    // }

    const posts = await db.post.findMany({
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit), // skip should start from 0 for page 1
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        votes: true,
        author: true,
        comments: true,
      },
      where: whereClause,
    })


    return new Response(JSON.stringify(posts))
  } catch (error) {
    return new Response('Could not fetch posts', { status: 500 })
  }
}
