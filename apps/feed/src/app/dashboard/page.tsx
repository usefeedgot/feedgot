import React from 'react'
import type { Metadata } from 'next'
import { createPageMetadata } from '@/lib/seo'
import UserInfo from '@/components/auth/UserInfo'

export const metadata: Metadata = createPageMetadata({
  title: 'Dashboard',
  description: 'Overview of your projects in Feedgot.',
  path: '/dashboard',
  indexable: false,
})

const Homepage = () => {
  return (
    <div className="">
      <div className="p-4">
        <UserInfo />
      </div>
    </div>
  )
}

export default Homepage

