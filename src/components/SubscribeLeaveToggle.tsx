'use client'
import { Button } from '@/components/ui/Button'
import { SubscribeToSubredditPayload } from '@/lib/validators/subscription'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { startTransition } from 'react'
import { useToast } from '../hooks/use-toast'
import { useCustomToasts } from '@/hooks/use-custom-toasts'
import { RadiusUnits } from '@prisma/client'

interface SubscribeLeaveToggleProps {
  isSubscribed: boolean
  region: string
  regionType: string
  radius: number
  radiusUnits: RadiusUnits
  coordinates?: Array<number>
}

const SubscribeLeaveToggle = ({
  isSubscribed,
  region,
  regionType,
  radius,
  radiusUnits,
  coordinates,
}: SubscribeLeaveToggleProps) => {
  const { toast } = useToast()
  const { loginToast } = useCustomToasts()
  const router = useRouter()

  const { mutate: subscribe, isLoading: isSubLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubredditPayload = {
        region,
        regionType,
        radius,
        radiusUnits,
        coordinates
      }

      const { data } = await axios.post('/api/subscribe', payload)
      return data as string
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast()
        }
      }

      return toast({
        title: 'There was a problem.',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      })
    },
    onSuccess: () => {
      startTransition(() => {
        // Refresh the current route and fetch new data from the server without
        // losing client-side browser or React state.
        router.refresh()
      })
      toast({
        title: 'Subscribed!',
        description: `You are now subscribed to ${region}`,
      })
    },
  })

  const { mutate: unsubscribe, isLoading: isUnsubLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubredditPayload = {
        region,
        regionType,
        radius,
        radiusUnits
      }

      const { data } = await axios.post('/api/unsubscribe', payload)
      return data as string
    },
    onError: (err: AxiosError) => {
      toast({
        title: 'Error',
        description: err.response?.data as string,
        variant: 'destructive',
      })
    },
    onSuccess: () => {
      startTransition(() => {
        // Refresh the current route and fetch new data from the server without
        // losing client-side browser or React state.
        router.refresh()
      })
      toast({
        title: 'Unsubscribed!',
        description: `You are now unsubscribed from ${region}`,
      })
    },
  })

  return isSubscribed ? (
    <Button
      className='w-full mt-1 mb-4 bg-red-600 hover:bg-red-700'
      isLoading={isUnsubLoading}
      onClick={() => unsubscribe()}>
      Unsubscribe from {region}
    </Button>
  ) : (
    <Button
      className='w-full mt-1 mb-4 bg-green-600 hover:bg-green-700'
      isLoading={isSubLoading}
      onClick={() => subscribe()}>
      Subscribe to {region}
    </Button>
  )
}

export default SubscribeLeaveToggle
