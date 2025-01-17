import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import Image from 'next/image'
import { Icons } from './Icons'
import { Button, buttonVariants } from './ui/Button'
import { UserAccountNav } from './UserAccountNav'
import SearchBar from './SearchBar'
import { Heart } from 'lucide-react'

const Navbar = async () => {
  const session = await getServerSession(authOptions)
  return (
    <div className='fixed top-0 inset-x-0 h-fit bg-zinc-100 border-b border-zinc-300 z-[10] py-2'>
      <div className='container max-w-7xl h-full mx-auto flex items-center justify-between gap-2'>
        {/* logo */}
        <Link href='/' className='flex gap-2 items-center'>
          <Image
            src='/favicon.ico'
            alt='logo image'
            width={50}
            height={40}
          />
          <p className='hidden text-zinc-700 text-sm font-medium md:block'>Dwelling Debate</p>
        </Link>

        {/* search bar */}
        <SearchBar />

        {/* actions */}

        <Link href='/post/submit'> <Button size='default' className='bg-zinc-900 text-zinc-100 hover:bg-zinc-800'> Create {session ? null : " Anonymous "} Post </Button> </Link>


        <Link href='/donate'> <Button size='default' className='bg-[#FF954F] text-black hover:bg-[#ff7d28]'> Donate <Heart className='ml-2 fill-red-600'/>  </Button> </Link>

        {session?.user ? (
          <UserAccountNav user={session.user} />
        ) : (
          <Link href='/sign-in' className={buttonVariants()}>
            Sign In
          </Link>
        )}
      </div>
    </div>
  )
}

export default Navbar
