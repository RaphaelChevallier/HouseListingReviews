import { buttonVariants } from "@/components/ui/Button";
import { getAuthSession } from "@/lib/auth";
import { History } from "lucide-react";
import SubscribeLeaveToggle from "@/components/SubscribeLeaveToggle";
import { db } from "@/lib/db";
import Link from "next/link";
import { RadiusUnits, RegionType } from "@prisma/client";
import RegionFeed from "@/components/homepage/RegionFeed";
import RadarMap from "@/components/RadarMap";
import RadiusUnitsChange from "@/components/RadiusUnitsChange";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
import axios from 'axios';

interface LocationProps {
  params: {
    location: string;
    regionType: RegionType;
  },
  searchParams?: {
    radius?: number;
    radiusUnits?: RadiusUnits;
  }
}

export default async function Location({ params, searchParams }: LocationProps) {
  const session = await getAuthSession();

  const subscription = !session?.user
    ? undefined
    : await db.subscription.findFirst({
        where: {
          region: decodeURIComponent(params.location),
          regionType: params.regionType,
          user: {
            id: session.user.id,
          },
        },
      });


  const isSubscribed = !!subscription;

  const getPreciseCoordinates = async (location: string) => {
    const headers = {
      Authorization: 'prj_test_pk_372da21bdc800cb008116a62df37f05d3f2a32b0',
      };
  
      let results = await axios.get(`https://api.radar.io/v1/geocode/forward?query=${location}`, {headers: headers})
      let dataResults = await results.data
      return dataResults
  }

  const locationData = await getPreciseCoordinates(params.location)


  // if (!subscription) return notFound()

  return (
    <>
      <h1 className="font-bold text-3xl md:text-4xl">Region Search: {decodeURIComponent(params.location)}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
        {/* @ts-expect-error server component */}
        <RegionFeed
          location={params.location}
          regionType={params.regionType}
          radius={searchParams?.radius? searchParams.radius : 5}
          radiusUnits={searchParams?.radiusUnits? searchParams.radiusUnits : "KILOMETERS"}
        />

        {session ? (
          <div className="overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last">
            <div className="bg-emerald-100 px-6 py-4">
              <p className="font-semibold py-3 flex items-center gap-1.5">
                <History className="h-4 w-4" />
                {decodeURIComponent(params.location)}
              </p>
            </div>
            <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
              <div className="flex justify-between gap-x-4 py-3">
                <p className="text-zinc-500">
                  Posts in the region that you chose. Here to check in with the
                  region and subscribe to keep track in your main feed!
                </p>
              </div>
              <RadiusUnitsChange params={params} props={{radius: searchParams?.radius? searchParams.radius : 5, radiusUnits: searchParams?.radiusUnits? searchParams.radiusUnits : "KILOMETERS"}}/>
              <SubscribeLeaveToggle
                isSubscribed={isSubscribed}
                region={decodeURIComponent(params.location)}
                regionType={params.regionType}
                radius={searchParams?.radius? searchParams.radius : 5}
                radiusUnits={searchParams?.radiusUnits? searchParams.radiusUnits : "KILOMETERS"}
                coordinates={locationData.addresses[0].geometry.coordinates}
              />

              <Link
                className={buttonVariants({
                  className: "w-full mt-4 mb-6",
                })}
                href={`/post/submit`}
              >
                Create Post
              </Link>
            </dl>
            <RadarMap location={locationData.addresses[0].geometry.coordinates} radius={searchParams?.radius? searchParams.radius : 5} radiusUnits={searchParams?.radiusUnits? searchParams.radiusUnits : "KILOMETERS"}/>

          </div>
        ) : (
          <div className="overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last">
            <div className="bg-emerald-100 px-6 py-4">
              <p className="font-semibold py-3 flex items-center gap-1.5">
                <History className="h-4 w-4" />
                {decodeURIComponent(params.location)}
              </p>
            </div>
            <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
              <div className="flex justify-between gap-x-4 py-3">
                <p className="text-zinc-500">
                  Posts in the region that you chose. Here to check in with the
                  region subscribe to keep track in your main feed!
                </p>
              </div>

              <Link
                className={buttonVariants({
                  className: "w-full mt-4 mb-6",
                })}
                href={`/post/submit`}
              >
                Create Post
              </Link>
            </dl>
            <RadarMap location={locationData.addresses[0].geometry.coordinates} radius={searchParams?.radius? searchParams.radius : 5} radiusUnits={searchParams?.radiusUnits? searchParams.radiusUnits : "KILOMETERS"}/>
          </div>
        )}
      </div>
    </>
  );
}
