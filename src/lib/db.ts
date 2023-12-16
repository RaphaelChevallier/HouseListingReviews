import { ExtendedPost } from '@/types/db';
import { PrismaClient, VoteType } from '@prisma/client'
import { Decimal, JsonObject } from '@prisma/client/runtime/library'
import { INFINITE_SCROLL_PAGINATION_RESULTS } from '@/config'
import cuid from 'cuid';
import "server-only"

type LocationPoint = {
  latitude: Decimal | undefined
  longitude: Decimal | undefined
}

type SearchPost = {
  id: string,
  title: string,
  listingUrl: string,
  address: string,
  streetAddress: string,
  postalCode: string,
  city: string,
  country: string,
  county: string,
  content: JSON,
  authorId: string,
  location: LocationPoint
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
          }
        }) {
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
        async findPointsWithin(latitude: Decimal, longitude: Decimal, milesRadius: number) {
          // Query for clostest points of interests
          const result = await prisma.$queryRaw<
            {
              postId: string,
              title: string,
              listingUrl: string,
              address: string,
              streetAddress: string,
              postalCode: string,
              city: string,
              country: string,
              county: string,
              content: JsonObject,
              authorId: string,
              name: string,
              email: string,
              emailVerified: Date,
              username: string,
              image: string,
              createdAt: Date,
              updatedAt: Date,
              st_x: Decimal | undefined,
              st_y: Decimal | undefined,
              comment_ids: string[],
              comment_texts: string[],
              comment_authorId: string[],
              comment_postId: string[],
              comment_replyToId: string[],
              comment_commentId: string[],
              comment_createdAt: Date[],
              comment_updatedAt: Date[],
              commentVote_userId: string[],
              commentVote_createdAt: Date[],
              commentVote_commentId: string[],
              commentVote_type: VoteType[],
              commentVote_updatedAt: Date[],
              postVote_userId: string[],
              postVote_createdAt: Date[],
              postVote_postId: string[],
              postVote_type: VoteType[]
              postVote_updatedAt: Date[],
            }[]
          >`SELECT p."id" as "postId", p."title", p."listingUrl", p."address", p."streetAddress", p."postalCode", p."city", p."country", p."county", p."content", p."authorId", p."createdAt", p."updatedAt", ST_X(location::geometry), ST_Y(location::geometry), u.*, array_agg(c.text) as "comment_texts", array_agg(c.id) as "comment_ids", array_agg(c."createdAt") as "comment_createdAt", array_agg(c."updatedAt") as "comment_updatedAt", array_agg(c."authorId") as "comment_authorId", array_agg(c."postId") as "comment_postId", array_agg(c."replyToId") as "comment_replyToId", array_agg(c."commentId") as "comment_commentId",
              array_agg(cv."userId") as "commentVote_userId", array_agg(cv."createdAt") as "commentVote_createdAt", array_agg(cv."updatedAt") as "commentVote_updatedAt", array_agg(cv."userId") as "commentVote_userId", array_agg(cv."commentId") as "commentVote_commentId", array_agg(cv."type") as "commentVote_type",
              array_agg(v."userId") as "postVote_userId", array_agg(v."createdAt") as "postVote_createdAt", array_agg(v."updatedAt") as "postVote_updatedAt", array_agg(v."postId") as "postVote_postId", array_agg(v."type") as "postVote_type"
              FROM "Post" as p LEFT JOIN "User" as u ON p."authorId" = u."id" LEFT JOIN "Comment" as c ON p."id" = c."postId" LEFT JOIN "Vote" as v ON p."id" = v."postId" LEFT JOIN "CommentVote" as cv ON c."id" = cv."commentId"
              WHERE ST_DistanceSphere(location::geometry, ST_MakePoint(${longitude},${latitude})) <= Prisma.Decimal(${milesRadius})
              GROUP BY p."id", u."id"
              ORDER BY p."createdAt" DESC
              LIMIT ${INFINITE_SCROLL_PAGINATION_RESULTS}`
          // use this if you decide to want to order by location proximity as well
          //ORDER BY ST_DistanceSphere(location::geometry, ST_MakePoint(${latitude}, ${longitude})) DESC`

          // Transform to our custom type
          const pois: ExtendedPost[] = result.map((data) => {
            let comments = []
            for (let i = 0; i < data.comment_ids.length; i++) {
              let commentVotes = []
                if (data.comment_ids[i] === data.commentVote_userId[i]) {
                  let newCommentVote = {
                    userId: data.commentVote_userId[i],
                    createdAt: data.commentVote_createdAt[i],
                    commentId: data.commentVote_commentId[i],
                    type: data.commentVote_type[i],
                    updatedAt: data.commentVote_updatedAt[i],
                  }
                  commentVotes.push(newCommentVote)
                }
              if (data.postId === data.comment_postId[i]) {
                let newComment = {
                  id: data.comment_ids[i],
                  text: data.comment_texts[i],
                  authorId: data.comment_authorId[i],
                  postId: data.comment_postId[i],
                  replyToId: data.comment_replyToId[i],
                  commentId: data.comment_commentId[i],
                  createdAt: data.comment_createdAt[i],
                  updatedAt: data.comment_updatedAt[i],
                  commentVotes: commentVotes
                }
                comments.push(newComment)
              }
            }
            let postVotes = []
            for (let i = 0; i < data.comment_ids.length; i++) {
              if (data.postId === data.postVote_postId[i]) {
                let newVote = {
                  userId: data.postVote_userId[i],
                  createdAt: data.postVote_createdAt[i],
                  postId: data.postVote_postId[i],
                  type: data.postVote_type[i],
                  updatedAt: data.postVote_updatedAt[i]
                }
                postVotes.push(newVote)
              }
            }

            return {
              id: data.postId,
              title: data.title,
              listingUrl: data.listingUrl,
              address: data.address,
              streetAddress: data.streetAddress,
              postalCode: data.postalCode,
              city: data.city,
              country: data.country,
              county: data.county,
              content: data.content,
              authorId: data.authorId,
              author: {
                id: data.authorId,
                name: data.name,
                email: data.email,
                emailVerified: data.emailVerified,
                username: data.username,
                image: data.image
              },
              createdAt: data.createdAt,
              updatedAt: data.updatedAt,
              location: {
                latitude: data.st_x || undefined,
                longitude: data.st_y || undefined,
              },
              comments: comments,
              votes: postVotes
            }
          })

          // Return data
          return pois
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