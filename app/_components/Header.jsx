"use client"
import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'


// rfce
function Header() {
  return (
    <div className="flex justify-between bg-slate-900 p-1 shadow-md">
        <Image src={'./name-logo-black.svg'} alt="Logo" width={50} height={50}/>
        <Link href={'/dashboard'}>
        <Button>Get started</Button>
      </Link>
    </div>
  )
}
    
export default Header
