import { test as testBase } from '@playwright/test'
import { createShippingData, createUserCredentialsData } from '../data/factories'
import { CHECKOUT_COMPLETE, CHECKOUT_ERRORS, LOGIN_ERRORS, USERS } from '../data/static'
import { CartPage, CheckoutCompletePage, CheckoutOnePage, CheckoutTwoPage, InventoryItemPage, InventoryPage, LoginPage } from '../pages'

export type AllFixtures = {
  pages: {
    login: LoginPage
    inventory: InventoryPage
    inventoryItem: InventoryItemPage
    cart: CartPage
    checkoutOne: CheckoutOnePage
    checkoutTwo: CheckoutTwoPage
    checkoutComplete: CheckoutCompletePage
  }
  users: typeof USERS
  testData: {
    loginErrors: typeof LOGIN_ERRORS
    create: { shipping: typeof createShippingData; userCredentials: typeof createUserCredentialsData }
    checkoutErrors: typeof CHECKOUT_ERRORS
    checkoutComplete: typeof CHECKOUT_COMPLETE
  }
}
export const test = testBase.extend<AllFixtures>({
  pages: async ({ page }, use) => {
    const pageFixtures = {
      login: new LoginPage(page),
      inventory: new InventoryPage(page),
      inventoryItem: new InventoryItemPage(page),
      cart: new CartPage(page),
      checkoutOne: new CheckoutOnePage(page),
      checkoutTwo: new CheckoutTwoPage(page),
      checkoutComplete: new CheckoutCompletePage(page)
    }
    await use(pageFixtures)
  },
  users: async ({}, use) => {
    await use(USERS)
  },

  testData: [
    async ({}, use) => {
      const dataFixtures = {
        loginErrors: LOGIN_ERRORS,
        create: { shipping: createShippingData, userCredentials: createUserCredentialsData },
        checkoutErrors: CHECKOUT_ERRORS,
        checkoutComplete: CHECKOUT_COMPLETE
      }
      await use(dataFixtures)
    },
    { box: true }
  ]
})
