import { Mic } from 'lucide-react'
import React from 'react'
import Link from 'next/link'
const Navbar = () => {
  return (
    <div className='fixed top-0 left-0 right-0 z-50 flex flex-row justify-between items-center w-full px-12 py-5 bg-background/80 backdrop-blur-sm border-b border-border'>
        <div className='text-3xl font-bold gradiant-bg bg-clip-text flex text-transparent items-center w-[230px] justify-between cursor-pointer'>
            <div className="gradiant-bg rounded-2xl p-3 w-fit">
                <Mic color='#ffffff'/>
            </div>
            <Link href={'/'}>Interview Ai</Link>
        </div>
        <div className='flex flex-row gap-6 text-lg font-medium'>
            <Link href={'/sign-in'}>
                <div className='hover:underline cursor-pointer'>Login</div>
            </Link>
            <Link href={'/interview'}>
                <div className='hover:underline cursor-pointer'>Get Start</div>
            </Link>
        </div>  
    </div>
  )
}

export default Navbar