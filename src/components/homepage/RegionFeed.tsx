import { INFINITE_SCROLL_PAGINATION_RESULTS } from '@/config'
import { db } from '@/lib/db'
import PostFeed from '../PostFeed'
import { RegionType } from '@prisma/client'
import axios, { AxiosRequestHeaders } from 'axios'

interface RegionParams {
      location: string
      regionType: RegionType
      radius: number
      radiusUnits: string
  }

const RegionFeed = async (params: RegionParams) => {
    const headers = {
        Authorization: process.env.RADAR_PROJECT_PUBLIC_KEY,
        } as AxiosRequestHeaders;

        if (!params) return new Response('Invalid query', { status: 400 })

        let results;
        let dataResults;
        let type: any;
        if(params.regionType != RegionType.USER){
            if(params.regionType === RegionType.CITY){
                type = "locality"
            } else if (params.regionType != RegionType.ZIP){
                type = "postalCode"
            } else {
                type = params.regionType
            }
        results = await axios.get(`https://api.radar.io/v1/geocode/forward?query=${params.location}&layers=${type.toLowerCase()}`, {headers: headers})
        dataResults = await results.data
        console.log(dataResults)
        }
//   const posts = await db.post.findMany({
//     where: {
//       author: { username: username.user},
//     },
//     orderBy: {
//       createdAt: 'desc',
//     },
//     include: {
//       votes: true,
//       author: true,
//       comments: true,
//     },
//     take: INFINITE_SCROLL_PAGINATION_RESULTS,
//   })

//   return <PostFeed initialPosts={posts} />
return null
}

export default RegionFeed