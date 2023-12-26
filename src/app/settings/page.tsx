import { redirect } from 'next/navigation'
import Link from 'next/link'
import { UserNameForm } from '@/components/UserNameForm'
import { authOptions, getAuthSession } from '@/lib/auth'
import { Button } from '@/components/ui/Button'

export const metadata = {
  title: 'Settings',
  description: 'Manage account and website settings.',
}

export default async function SettingsPage() {
  const session = await getAuthSession()

  if (!session?.user) {
    redirect(authOptions?.pages?.signIn || '/login')
  }

  return (
    <div className='max-w-4xl mx-auto py-12'>
      <div className='grid items-start gap-8'>
        <h1 className='font-bold text-3xl md:text-4xl'>Settings</h1>

        <div className='grid gap-10'>
          <UserNameForm
            user={{
              id: session.user.id,
              username: session.user.username || '',
            }}
          />
        </div>
        <div className='grid gap-10'>
            <Link href='/about'> <Button size='default' variant='ghost' className='text-black '> Learn More </Button> </Link>
        </div>
      </div>
    </div>
  )
}
