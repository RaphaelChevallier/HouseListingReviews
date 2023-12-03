import { z } from 'zod'

export const SubscriptionValidator = z.object({
  region: z.string(),
  regionType: z.string(),
  radius: z.number(),
  radiusUnits: z.string(),
})

export type SubscribeToSubredditPayload = z.infer<
  typeof SubscriptionValidator
>
