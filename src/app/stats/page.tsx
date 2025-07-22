'use client';
import React from 'react';
import { useEffect } from 'react';


function Page() {

  useEffect(() => {
    document.title = 'Stats - Intellecto';
  }, []);



  return (
    <div className='h-[100vh] w-full flex items-center justify-center text-2xl font-bold text-blue-400'>
      Page under construction. Please check back later.
    </div>
  )
}
export default Page