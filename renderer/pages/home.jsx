import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
  return (
    <div className="flex flex-col text-2xl w-screen h-screen text-center p-12">
        
        <div className="h-1/5">
          <Link href="/start">
            <a className="">Start</a>
          </Link>
        </div>

        <div className="h-1/5">
          <Link href="/characters">
            <a className="">Characters</a>
          </Link>
        </div>

        <div className="h-1/5">
          <Link href="/monsters">
            <a className="">Monsters</a>
          </Link>
        </div>

        <div className="h-1/5">
          <Link href="/music">
            <a className="">Music</a>
          </Link>
        </div>

        <div className="h-1/5">
          <Link href="/options">
            <a className="">Options</a>
          </Link>
        </div>

      </div>
  )
}
