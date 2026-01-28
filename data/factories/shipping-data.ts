import { faker } from '@faker-js/faker'
import type { ShippingData } from '../../types'

export const createShippingData = (): ShippingData => ({
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  postal: faker.location.zipCode()
})
