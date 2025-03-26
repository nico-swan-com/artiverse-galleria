import { getDataSource } from '@/lib/database/data-source'
import { User } from './user.entity'
import { Repository } from 'typeorm'

export class UsersRepository {
  get userRepository(): Repository<User> {
    return getDataSource().getRepository(User)
  }

  async getUsers() {
    try {
      return await this.userRepository.find()
    } catch (error) {
      console.error('Error getting users:', error)
      return []
    }
  }

  async getUserById(id: number) {
    try {
      return await this.userRepository.findOne({ where: { id } })
    } catch (error) {
      console.error('Error getting user by id:', error)
      return null
    }
  }
  async getUserByEmail(email: string) {
    try {
      return await this.userRepository.findOne({
        where: { email }
      })
    } catch (error) {
      console.error('Error getting user by email:', error)
      return null
    }
  }

  async createUser(user: User) {
    try {
      return await this.userRepository.save(user)
    } catch (error) {
      console.error('Error creating user:', error)
      return null
    }
  }
}
