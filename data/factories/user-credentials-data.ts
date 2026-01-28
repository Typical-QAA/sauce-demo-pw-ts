import { faker } from '@faker-js/faker'
import type { UserDataCredentials } from '../../types'

export const createUserCredentialsData = (): UserDataCredentials => ({
  username: faker.internet.username(),
  password: faker.internet.password()
})
