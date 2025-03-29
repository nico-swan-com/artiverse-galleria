'use client'

import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { User } from '@/lib/users'

interface UserSearchProps {
  users: User[]
  onSearch: (query: string) => void
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const UserSearch = ({ users, onSearch }: UserSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    onSearch(searchQuery)
  }, [searchQuery, onSearch])

  return (
    <div className='relative'>
      <Search className='absolute left-3 top-3 size-4 text-muted-foreground' />
      <Input
        placeholder='Search users...'
        className='pl-9'
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  )
}

export default UserSearch
