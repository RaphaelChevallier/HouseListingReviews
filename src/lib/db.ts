import { PrismaClient } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'
import cuid from 'cuid';
import "server-only"

type LocationPoint = {
  latitude: Decimal
  longitude: Decimal
}

const extendedPrismaClient = () => {
  const prisma = new PrismaClient({
  });

  const extendedPrisma = prisma.$extends({
    model: {
      post: {
        async create(data: {
          data: {
          title: String,
          listingUrl: String | undefined,
          address: String,
          streetAddress: String,
          postalCode: String,
          city: String,
          country: String,
          county: String,
          longitude: Decimal,
          latitude: Decimal,
          content: JSON,
          authorId: String
        }}) {
          // Create an object using the custom types from above
          const poi: LocationPoint = {
            latitude: data.data.latitude,
            longitude: data.data.longitude,
          }
          // Insert the object into the database
          const point = `POINT(${poi.longitude} ${poi.latitude})`
          const id = cuid();
          await prisma.$queryRaw`INSERT INTO "Post" ("id", "title", "address", "streetAddress", "postalCode", "city", "county", "country", "location", "content", "listingUrl", "authorId") VALUES (${id}, ${data.data.title},${data.data.address}, ${data.data.streetAddress},${data.data.postalCode}, ${data.data.city}, ${data.data.county}, ${data.data.country}, ST_GeomFromText(${point}, 4326), ${data.data.content}, ${data.data.listingUrl}, ${data.data.authorId});`
          // Return the object
          return poi
        },
      },
    },
  });

  return extendedPrisma;
};

export type ExtendedPrismaClient = ReturnType<typeof extendedPrismaClient>;
declare global {
  // eslint-disable-next-line no-var, no-unused-vars
  var cachedPrisma: ExtendedPrismaClient | undefined;
}

export const db = global.cachedPrisma || extendedPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.cachedPrisma = db;
}