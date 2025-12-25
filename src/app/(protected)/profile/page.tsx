import { auth } from '@/lib/authentication/next-auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/database/drizzle'
import { users } from '@/lib/database/schema'
import { eq } from 'drizzle-orm'
import React from 'react'
import PageTransition from '@/components/common/utility/PageTransition'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import UserProfileForm from '@/components/profile/UserProfileForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Profile | Artiverse Galleria',
  description: 'Manage your profile and account settings'
}

const ProfilePage = async () => {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/auth/login')
  }

  const currentUser = await db.query.users.findFirst({
    where: eq(users.id, session.user.id)
  })

  if (!currentUser) {
    return <div>User not found</div>
  }

  return (
    <PageTransition>
      <div className='max-w-4xl space-y-6'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Profile</h1>
          <p className='text-muted-foreground'>
            Manage your account settings and preferences.
          </p>
        </div>

        <Tabs defaultValue='general' className='w-full'>
          <TabsList className='grid w-full grid-cols-3 lg:w-[400px]'>
            <TabsTrigger value='general'>General</TabsTrigger>
            <TabsTrigger value='activity'>Activity</TabsTrigger>
            <TabsTrigger value='billing'>Billing</TabsTrigger>
          </TabsList>

          <TabsContent value='general' className='mt-6 rounded-md border p-6'>
            <UserProfileForm user={JSON.parse(JSON.stringify(currentUser))} />
          </TabsContent>

          <TabsContent value='activity' className='mt-6 rounded-md border p-6'>
            <div className='flex h-[200px] flex-col items-center justify-center text-center'>
              <div className='rounded-full bg-muted p-4'>
                <span className='text-2xl'>📊</span>
              </div>
              <h3 className='mt-4 text-lg font-medium'>Activity Tracking</h3>
              <p className='mt-2 text-sm text-muted-foreground'>
                Your recent activity and history will appear here.
              </p>
            </div>
          </TabsContent>

          <TabsContent value='billing' className='mt-6 rounded-md border p-6'>
            <div className='flex h-[200px] flex-col items-center justify-center text-center'>
              <div className='rounded-full bg-muted p-4'>
                <span className='text-2xl'>💳</span>
              </div>
              <h3 className='mt-4 text-lg font-medium'>Billing & Payments</h3>
              <p className='mt-2 text-sm text-muted-foreground'>
                Payment history and subscriptions will appear here.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  )
}

export default ProfilePage
