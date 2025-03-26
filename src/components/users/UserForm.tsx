'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { User } from '@/types/user'
import { toast } from 'sonner'

interface UserFormProps {
  onSubmit: (user: Omit<User, 'id'>) => void
}

const UserForm: React.FC<UserFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Viewer',
    status: 'Active',
    avatar: '/placeholder.svg'
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email) {
      toast.error('Please fill in all required fields')
      return
    }

    onSubmit({
      ...formData,
      createdAt: new Date().toISOString()
    })

    toast.success('User added successfully')

    // Reset form
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'Viewer',
      status: 'Active',
      avatar: '/placeholder.svg'
    })
  }

  return (
    <form onSubmit={handleSubmit} className='mt-4 space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='name'>Name *</Label>
        <Input
          id='name'
          name='name'
          value={formData.name}
          onChange={handleChange}
          placeholder='John Doe'
          required
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='email'>Email *</Label>
        <Input
          id='email'
          name='email'
          type='email'
          value={formData.email}
          onChange={handleChange}
          placeholder='john@example.com'
          required
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='role'>Role</Label>
        <Select
          value={formData.role}
          onValueChange={(value) => handleSelectChange('role', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder='Select role' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='Admin'>Admin</SelectItem>
            <SelectItem value='Editor'>Editor</SelectItem>
            <SelectItem value='Viewer'>Viewer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='status'>Status</Label>
        <Select
          value={formData.status}
          onValueChange={(value) => handleSelectChange('status', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder='Select status' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='Active'>Active</SelectItem>
            <SelectItem value='Inactive'>Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='flex justify-end pt-4'>
        <Button type='submit'>Add User</Button>
      </div>
    </form>
  )
}

export default UserForm
