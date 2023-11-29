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
  if(searchType != 'user'){
    if(searchType === 'city'){
      searchType = 'locality'
    }
    results = await axios.get(`https://api.radar.io/v1/search/autocomplete?query=${q}&layers=${searchType}`, {headers: headers})
  } else {
    return new Response()
  }
  // const results = await db.subreddit.findMany({
  //   where: {
  //     name: {
  //       startsWith: q,
  //     },
  //   },
  //   include: {
  //     _count: true,
  //   },
  //   take: 5,
  // })

  return new Response(JSON.stringify(await results.data))
}
