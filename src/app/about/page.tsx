import ToFeedButton from '@/components/ToFeedButton'
import { authOptions, getAuthSession } from '@/lib/auth'
import Image from 'next/image'
import Link from 'next/link'
import bitcoinQR from '../../../public/qr-code-dynamic.webp'


export const metadata = {
  title: 'Donate',
  description: 'Support the cause to keep open discussion on property listings!',
}

export default async function Donate() {
  const session = await getAuthSession()

  return (
    <>
        <ToFeedButton/>
        <div className='max-w-6xl mx-auto py-12'>
        
        <div className='grid items-start gap-8'>
            <h1 className='font-bold text-3xl md:text-4xl'>About</h1>
            <div className='grid grid grid-cols-6 gap-6'>
            <div className='col-span-4 rounded-md bg-white shadow p-4' >
                
            </div>
            
            </div>
        </div>
        </div>
    </>
  )
}