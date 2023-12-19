import { z } from 'zod'

export const SubscriptionValidator = z.object({
  region: z.string(),
  regionType: z.string(),
  radius: z.number(),
  radiusUnits: z.string(),
  coordinates: z.any()
})

export type SubscribeToSubredditPayload = z.infer<
  typeof SubscriptionValidator
>
