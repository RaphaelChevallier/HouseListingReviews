import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { PostValidator } from '@/lib/validators/post'
import { z } from 'zod'
import cuid from 'cuid'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { title,listingUrl, address, stateOrProvince, stateOrProvinceCode, streetAddress, postalCode, city, country, countryCode, county, longitude, latitude, content } = PostValidator.parse(body)

    const session = await getAuthSession()

    if (!session) {
      const anonId = cuid();
      const newPostId = await db.post.create({
        data: {
          title,
          listingUrl,
          address,
          stateOrProvince,
          stateOrProvinceCode,
          streetAddress,
          postalCode,
          city,
          country,
          countryCode,
          county,
          longitude,
          latitude,
          content,
          authorId: "Anonymous-" + anonId,
        },
      })
      return new Response(newPostId)
    } else if (!session?.user) {
      return new Response('Unauthorized', { status: 401 })
    } else {
    const newPostId = await db.post.create({
      data: {
        title,
        listingUrl,
        address,
        stateOrProvince,
        stateOrProvinceCode,
        streetAddress,
        postalCode,
        city,
        country,
        countryCode,
        county,
        longitude,
        latitude,
        content,
        authorId: session.user.id,
      },
    })
    return new Response(newPostId)
  }

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
