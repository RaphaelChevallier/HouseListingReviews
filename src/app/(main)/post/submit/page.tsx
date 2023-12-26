import { Editor } from '@/components/Editor'
import { Button } from '@/components/ui/Button'
import { getAuthSession } from '@/lib/auth'

interface pageProps {
}

const page = async ({ }: pageProps) => {
  const session = await getAuthSession()

  return (
    <div className='flex flex-col items-start gap-6'>
      {/* heading */}
      <div className='border-b border-gray-200 pb-5'>
        <div className='-ml-2 -mt-2 flex flex-wrap items-baseline'>
        {session? <h3 className='ml-2 mt-2 text-base font-semibold leading-6 text-gray-900'>
            Create Post
          </h3> :
          <h3 className='ml-2 mt-2 text-base font-semibold leading-6 text-gray-900'>
            Create Anonymous Post
          </h3>
          }
        </div>
      </div>

      {/* form */}
      <Editor  />

      <div className='w-full flex justify-end'>
        <Button type='submit' className='w-full' form='subreddit-post-form'>
          Post
        </Button>
      </div>
    </div>
  )
}

export default page
