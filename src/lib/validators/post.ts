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
  address: z.any(),
  stateOrProvince: z.any(),
  streetAddress: z.any(),
  postalCode: z.any(),
  city: z.any(),
  country: z.any(),
  county: z.any(),
  longitude: z.any(),
  latitude: z.any(),
  content: z.any(),
})

export type PostCreationRequest = z.infer<typeof PostValidator>
