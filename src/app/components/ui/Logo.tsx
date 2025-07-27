import React from 'react'
import Image from 'next/image'
import logoimage from "../../../../public/Header.jpg"
function Logo() {
  return (
    <div className='bg-[#242E3A] py-8'>
      <Image 
      src={logoimage}
      alt='Logo slider'
      className='mx-auto'/>
    </div>
  )
}

export default Logo