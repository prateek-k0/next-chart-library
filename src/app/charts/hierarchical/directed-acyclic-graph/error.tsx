'use client' // Error components must be Client Components
 
import IconError from '@/components/icons/IconError'
import { useEffect } from 'react'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])
 
  return (
    <div className='flex items-center justify-center flex-col gap-6 my-16'>
      <IconError width={128} height={128} className="text-red-500"/>
      <p className="text-4xl font-extralight font-sans">Something went wrong!</p>
      <button className="px-6 py-2 border rounded-md bg-zinc-700 hover:bg-zinc-800" onClick={reset}>
        Reload 
      </button>
    </div>
  )
}