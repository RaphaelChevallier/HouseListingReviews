import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { PostValidator } from '@/lib/validators/post'
import { z } from 'zod'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { title,listingUrl, address, streetAddress, postalCode, city, country, county, longitude, latitude, content } = PostValidator.parse(body)

    const session = await getAuthSession()

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 })
    }

    await db.post.create({
      data: {
        title,
        listingUrl,
        address,
        streetAddress,
        postalCode,
        city,
        country,
        county,
        longitude,
        latitude,
        content,
        authorId: session.user.id,
      },
    })

    return new Response('OK')
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 })
    }
    return new Response(
      'Could not post at this time. Please try later',
      { status: 500 }
    )
  }
}
