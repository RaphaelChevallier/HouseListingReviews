import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

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
    const { limit, page, region, regionType } = z
      .object({
        limit: z.string(),
        page: z.string(),
        regionType: z.string().nullish().optional(),
        region: z.string().nullish().optional(),
      })
      .parse({
        limit: url.searchParams.get('limit'),
        page: url.searchParams.get('page'),
        region: url.searchParams.get('region'),
        regionType: url.searchParams.get('regionType'),
      })

    let whereClause = {}

    if (regionType === "USER") {
      whereClause = {
        regionType: regionType,
        region: region
      }
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
