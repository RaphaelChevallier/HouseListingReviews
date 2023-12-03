import { db } from '@/lib/db'
import axios, {AxiosRequestHeaders} from 'axios'

function camelize(str: String) {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
    if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  });
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const q = url.searchParams.get('q')
  let searchType = camelize(url.searchParams.get('searchType') || "")
  const headers = {
    Authorization: process.env.RADAR_PROJECT_PUBLIC_KEY,
  } as AxiosRequestHeaders;

  if (!q) return new Response('Invalid query', { status: 400 })

  let results;
  let dataResults;
  if(searchType != 'user'){
    if(searchType === 'city'){
      searchType = 'locality'
    }
    results = await axios.get(`https://api.radar.io/v1/search/autocomplete?query=${q}&layers=${searchType}`, {headers: headers})
    dataResults = await results.data
    if(searchType === 'country'){
      dataResults.addresses.map((address: any) => {address.formattedAddress = address.addressLabel})
    } else if (searchType === 'county'){
      dataResults.addresses.map((address: any) => {address.formattedAddress = address.addressLabel + ", " + address.stateCode + ", " + address.country})
    } else if (searchType === 'state'){
      dataResults.addresses.map((address: any) => {address.formattedAddress = address.addressLabel + " - " + address.stateCode + ", " + address.country})
    }
  } else {
     const users = await db.user.findMany({
      where: {
        username: {
          startsWith: q,
        },
      },
      include: {
        _count: true,
      },
      take: 10,
    })
    dataResults = users
  }

  return new Response(JSON.stringify(dataResults))
}
