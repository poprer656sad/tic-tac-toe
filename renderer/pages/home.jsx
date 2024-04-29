import React, { useContext } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {


  return (
    <div className="flex flex-col text-2xl w-screen h-screen text-center p-12">
        
        <div className="h-1/5">
          <Link href="/play">
            <div>
              Play
            </div>
          </Link>
        </div>

        <div className="h-1/5">
          <Link href="/saved">
            <div>Saved</div>
          </Link>
        </div>

      </div>
  )
}
