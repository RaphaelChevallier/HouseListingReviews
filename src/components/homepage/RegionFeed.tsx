import { db } from '@/lib/db'
import PostFeed from '../PostFeed'
import { ExtendedPost } from '@/types/db'
import { RegionType, RadiusUnits } from '@prisma/client'
import axios, { AxiosRequestHeaders } from 'axios'

interface RegionParams {
      location: string
      regionType: RegionType
      radius: number
      radiusUnits: RadiusUnits
  }

  export function convertToMeters(radius: number, radiusUnits: RadiusUnits): number{
    if (radiusUnits === RadiusUnits.KILOMETERS) {
        return radius * 1000;
    } else if (radiusUnits === RadiusUnits.MILES) {
        return radius * 1609.34;
    } else if (radiusUnits === RadiusUnits.YARDS) {
        return radius / 1.094;
    } else {
        return radius / 1;
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
                type = params.regionType.toLowerCase()
            }
        results = await axios.get(`https://api.radar.io/v1/geocode/forward?query=${params.location}&layers=${type}`, {headers: headers})
        dataResults = await results.data
        }
    const posts = await db.post.findPointsWithin(
        dataResults.addresses[0].latitude,
        dataResults.addresses[0].longitude,
        convertToMeters(params.radius, params.radiusUnits)
      )

  return <PostFeed initialPosts={posts} region={params.location} regionType={type} latitude={dataResults.addresses[0].latitude} longitude={dataResults.addresses[0].longitude} radius={params.radius} radiusUnits={params.radiusUnits} />
}

export default RegionFeed