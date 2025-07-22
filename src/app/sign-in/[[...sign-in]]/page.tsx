import { SignIn } from '@clerk/nextjs'
import React from 'react'

function page() {
  return (
    <main className='h-[100vh] w-full flex items-center justify-center'>
      <SignIn />
    </main>
  )
}

export default page
