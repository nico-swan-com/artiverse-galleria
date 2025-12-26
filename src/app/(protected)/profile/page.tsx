import { auth } from '@/lib/authentication/next-auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/database/drizzle'
import { users } from '@/lib/database/schema'
import { eq } from 'drizzle-orm'
import React from 'react'
import PageTransition from '@/components/common/utility/PageTransition'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import UserProfileForm from '@/components/profile/UserProfileForm'
import OrderHistory from '@/components/profile/OrderHistory'
import ActivityFeed from '@/components/profile/ActivityFeed'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Profile | Artiverse Galleria',
  description: 'Manage your profile and account settings'
}

const ProfilePage = async () => {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/')
  }

  const currentUser = await db.query.users.findFirst({
    where: eq(users.id, session.user.id)
  })

  if (!currentUser) {
    return <div>User not found</div>
  }

  return (
    <PageTransition>
      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        <div className='mb-8'>
          <h1 className='text-2xl font-bold text-gray-900'>Profile Settings</h1>
          <p className='text-muted-foreground'>
            Manage your account preferences and personal information.
          </p>
        </div>

        <Tabs
          defaultValue='general'
          className='flex flex-col gap-8 lg:flex-row'
        >
          <div className='w-full lg:w-64'>
            <TabsList className='flex h-auto w-full flex-col space-y-1 bg-transparent p-0'>
              <TabsTrigger
                value='general'
                className='w-full justify-start rounded-md px-4 py-2 font-medium data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm'
              >
                General
              </TabsTrigger>
              <TabsTrigger
                value='activity'
                className='w-full justify-start rounded-md px-4 py-2 font-medium data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm'
              >
                Activity
              </TabsTrigger>
              <TabsTrigger
                value='billing'
                className='w-full justify-start rounded-md px-4 py-2 font-medium data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm'
              >
                Billing
              </TabsTrigger>
            </TabsList>
          </div>

          <div className='flex-1'>
            <TabsContent value='general' className='mt-0'>
              <div className='overflow-hidden rounded-lg bg-white shadow-sm'>
                <div className='border-b border-gray-100 bg-white p-6'>
                  <h2 className='text-lg font-semibold text-gray-900'>
                    General Information
                  </h2>
                  <p className='text-sm text-muted-foreground'>
                    Update your photo and personal details.
                  </p>
                </div>
                <div className='p-6'>
                  <UserProfileForm
                    user={JSON.parse(JSON.stringify(currentUser))}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value='activity' className='mt-0'>
              <div className='overflow-hidden rounded-lg bg-white p-6 shadow-sm'>
                <ActivityFeed />
              </div>
            </TabsContent>

            <TabsContent value='billing' className='mt-0'>
              <div className='overflow-hidden rounded-lg bg-white p-6 shadow-sm'>
                <OrderHistory />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </PageTransition>
  )
}

export default ProfilePage
