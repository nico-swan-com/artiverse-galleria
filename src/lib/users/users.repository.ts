import { Repository } from 'typeorm'
import { User } from './user.entity'
import { DatabaseRepository } from '../data-access'

@DatabaseRepository(User, 'userRepository')
class UsersRepository {
  userRepository!: Repository<User>
  async getUsers() {
    try {
      const users = (await this.userRepository).find()
      return users
    } catch (error) {
      console.error('Error getting users:', error)
      return []
    }
  }

  async getUserById(id: number) {
    try {
      return (await this.userRepository).findOne({ where: { id } })
    } catch (error) {
      console.error('Error getting user by id:', error)
      return null
    }
  }
  async getUserByEmail(email: string) {
    try {
      return (await this.userRepository).findOne({
        where: { email }
      })
    } catch (error) {
      console.error('Error getting user by email:', error)
      return null
    }
  }

  async createUser(user: User) {
    try {
      return (await this.userRepository).save(user)
    } catch (error) {
      console.error('Error creating user:', error)
      return null
    }
  }
}

const usersRepository = new UsersRepository()

export { UsersRepository, usersRepository }
