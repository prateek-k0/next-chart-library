import React from 'react'
import IconLoading from "@/components/icons/IconLoading";

const loading = () => {
  return (
    <div className='py-16 flex items-center justify-center'>
      <IconLoading width={128} height={128}/>
    </div>
  )
}

export default loading