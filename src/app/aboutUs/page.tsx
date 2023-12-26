import ToFeedButton from '@/components/ToFeedButton'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'


export const metadata = {
  title: 'About Us',
  description: 'Learn more on how to keep open discussion on property listings',
}

export default async function AboutUs() {

  return (
    <>
        <ToFeedButton/>
        <div className='max-w-6xl mx-auto py-12'>
        
        <div className='grid items-start gap-8'>
            <h1 className='font-bold text-3xl md:text-4xl'>About Us</h1>
            <div className='grid grid grid-cols-6 gap-6'>
            <div className='col-span-6 rounded-md bg-white shadow p-4' >
            <h1 className='flex justify-center mt-4 text-md font-semibold'>Welcome to Dwelling Debate!</h1>
              <h3 className='mt-2 text-sm'>We have a mission here to make real estate more approachable to the masses. Too long has the housing market been clouded by rich investors and real estate agents. This website is to create a free and open space to discuss any public house listing or property openly with other like minded people and individuals to share thoughts, concerns, and expertise.</h3>
              <p className='mt-2 text-sm'>This website is meant to be a forum for all that is related to housing. Whether you're a homeowner, a renter, or a real estate enthusiast, our platform provides a space to explore, learn, and discuss everything related to homes. Hopefully having widespread open discussion such as these on potential properties we all care about we can change the market more than the big players. We will not gather any more information than is necessary from you to create your account.</p>
              <p className='mt-2 text-sm'>This mission can also extend to rental opportunities. Please feel free to use this platform to discuss potential rental contracts as well.</p>
              <p className='mt-2 text-sm'>Please leave constructive comments and posts that align with the TOS. Be respectful to others and only post legitimate listings.</p>
              <p className='mt-2 text-sm'>We have very few resources at the moment to keep this website running and improving. However if you have any ideas or bugs you would like to report please reach out to my email: </p>
            </div>
              <Link target="_blank" rel="noreferrer" href='/Terms of Service for DwellingDebate.pdf'> <Button size='default' variant='ghost' className='text-black '> Terms of Service </Button> </Link>
              <Link target="_blank" rel="noreferrer" href='/Privacy Policy for DwellingDebate.pdf'> <Button size='default' variant='ghost' className='text-black '> Privacy Policy </Button> </Link>
              <Link target="_blank" rel="noreferrer" href='/sitemap-0.xml'> <Button size='default' variant='ghost' className='text-black '> SiteMap </Button> </Link>
            </div>
        </div>
        </div>
    </>
  )
}