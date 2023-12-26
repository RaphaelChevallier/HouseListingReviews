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
            <h1 className='font-bold text-3xl md:text-4xl'>Show Your Support!</h1>
            <div className='grid grid grid-cols-6 gap-6'>
            <div className='col-span-4 rounded-md bg-white shadow p-4' >
              <div className='w-[100%] h-[40%] relative '>
                <Image 
                  alt='profile pic' priority layout='fill' objectFit='contain' src='https://storage.ko-fi.com/cdn/useruploads/display/e759320c-3b6d-4ddc-819c-1fe188630e7d_img_3449.jpg'
                />
              </div>
              <h1 className='flex justify-center mt-4 text-md font-semibold'>My name is Raphael. Welcome to Home Listing Reviews!</h1>
              <h3 className='mt-2 text-sm'> I would like to thank you for your time using the services of Home Listing Reviews.</h3>
              <h3 className='mt-2 text-sm'>The mission here is to make real estate approachable. Too long has the housing market been clouded by rich investors and real estate agents. This website is to create a free and open space to discuss any public house listing or property openly with other like minded people and individuals to share thoughts, concerns, and expertise.</h3>
              <p className='mt-2 text-sm'>As a new graduate entering this world where housing is meant to be the pinnacle of the American Dream, it seems that it is more and more out of reach. If we can have open discussion on properties this should help the market retain its original value.</p>
              <p className='mt-2 text-sm'>This mission can also extend to rental opportunities. Please feel free to use this platform to discuss potential rental contracts as well.</p>
              <p className='mt-2 text-sm'>I am currently maintaining this website on my free time. As time progresses and upgrades to the website come in; any help from you, the dedicated users to making the real estate market more equitable, would be immensenly appreciated.</p>
              <p className='mt-2 text-sm'>Please show your support in any capacity through my Ko-Fi page on the right or my bitcoin wallet QR code below; or here: <Link target='_blank' href='https://ko-fi.com/raphaelchevallier' className='text-blue-500 hover:text-blue-700'>Buy me a coffee!</Link></p>
              
            </div>
            <div className='relative flex z-0 items-center'>
            <iframe id='kofiframe' src='https://ko-fi.com/raphaelchevallier/?hidefeed=true&widget=true&embed=true&preview=true' className='border:none;width:100%;padding:4px;background:#f9f9f9; shadow' height='875' title='raphaelchevallier'></iframe>
            <div className='absolute left-10 bottom-5 z-10'>
              <p className='text-sm font-semibold'>Bitcoin Address</p>
              <Image 
                  alt='bitcoin qr code pic' objectFit='contain' src={bitcoinQR}
                />
                </div>
                </div>
            </div>
        </div>
        </div>
    </>
  )
}