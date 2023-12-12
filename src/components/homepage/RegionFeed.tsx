import { INFINITE_SCROLL_PAGINATION_RESULTS } from '@/config'
import { db } from '@/lib/db'
import PostFeed from '../PostFeed'
import { RegionType, RadiusUnits } from '@prisma/client'
import axios, { AxiosRequestHeaders } from 'axios'

interface RegionParams {
      location: string
      regionType: RegionType
      radius: number
      radiusUnits: RadiusUnits
  }

function convertToMiles(radius: number, radiusUnits: RadiusUnits){
    if (radiusUnits === RadiusUnits.KILOMETERS) {
        return radius / 1.60934;
    } else if (radiusUnits === RadiusUnits.METERS) {
        return radius / 1609.34;
    } else if (radiusUnits === RadiusUnits.YARDS) {
        return radius / 1760;
    } else {
        return radius;
    }
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
            } else if (params.regionType === RegionType.ZIP){
                type = "postalCode"
            } else {
                type = params.regionType
            }
        results = await axios.get(`https://api.radar.io/v1/geocode/forward?query=${params.location}&layers=${type.toLowerCase()}`, {headers: headers})
        dataResults = await results.data
        }
    const posts = await db.post.findPointsWithin(
        dataResults.addresses[0].latitude,
        dataResults.addresses[0].longitude,
        convertToMiles(params.radius, params.radiusUnits)
      )

      console.log(posts)

  return <PostFeed initialPosts={posts} />
}

export default RegionFeed