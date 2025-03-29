import { User } from './user.entity'
import { UsersRepository } from './users.repository'

export default class Users {
  repository: UsersRepository

  constructor() {
    this.repository = new UsersRepository()
  }

  async getAllUsers(): Promise<User[]> {
    const users = await this.repository.getUsers()
    return users
  }
}
