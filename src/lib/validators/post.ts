import { z } from 'zod'

export const PostValidator = z.object({
  title: z
    .string()
    .min(3, {
      message: 'Title must be at least 3 characters long',
    })
    .max(128, {
      message: 'Title must be less than 128 characters long',
    }),
  listingUrl:  z.string().url().optional().or(z.literal('')),
  address: z.string(),
  streetAddress: z.string(),
  postalCode: z.string(),
  city: z.string(),
  country: z.string(),
  county: z.string(),
  longitude: z.number(),
  latitude: z.number(),
  content: z.any(),
})

export type PostCreationRequest = z.infer<typeof PostValidator>
