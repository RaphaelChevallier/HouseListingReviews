import ToFeedButton from '@/components/ToFeedButton'
import { UserNameForm } from '@/components/UserNameForm'
import { authOptions, getAuthSession } from '@/lib/auth'

export const metadata = {
  title: 'Donate',
  description: 'Support the cause to keep open discussion on property listings!',
}

export default async function Donate() {
  const session = await getAuthSession()

  return (
    <>
        <ToFeedButton/>
        <div className='max-w-4xl mx-auto py-12'>
        
        <div className='grid items-start gap-8'>
            <h1 className='font-bold text-3xl md:text-4xl'>Show Your Support!</h1>
                
            <div className='grid gap-10'>
            </div>
        </div>
        </div>
    </>
  )
}