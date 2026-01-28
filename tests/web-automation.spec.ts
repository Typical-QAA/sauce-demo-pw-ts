import { expect } from '@playwright/test'
import { TAGS } from '../data/constants'
import { test } from '../fixtures'
import type { ListItemDetails } from '../types'
import { addRandomItemFromInventory, validateFormErrorSequence, validateOneItemInCart, validatePageUrlAndHeaderTitle } from './helpers'

test.describe(`Web Automation Tests`, { tag: TAGS.TYPE.WEB }, () => {
  test(
    `Should not be able to login with empty or invalid data`,
    { tag: [TAGS.DOC.NOT_DOCUMENTED, TAGS.STATUS.EXPECTED_TO_PASS] },
    async ({ pages, testData }) => {
      const user = testData.create.userCredentials()
      const errors = testData.loginErrors
      const form = pages.login.form
      await test.step(`Open login page`, async () => {
        await pages.login.page.goto(pages.login.URL)
      })
      await test.step(`Validate errors on empty data`, async () => {
        const validationSteps = [
          { input: form.usernameInput, error: errors.LOGIN_REQ, value: user.username },
          { input: form.passwordInput, error: errors.PASSWORD_REQ, value: user.password }
        ]
        await validateFormErrorSequence(pages.login, pages.login.loginButton, validationSteps)
      })
      await test.step(`Validate error with invalid user`, async () => {
        await pages.login.form.usernameInput.clear()
        await pages.login.form.passwordInput.clear()
        await pages.login.fillAndSubmit(user)
        await expect(pages.login.form.errorMessage).toBeVisible()
        await expect(pages.login.form.errorMessage).toHaveText(errors.INVALID_USER)
        const checkElements = [pages.login.form.usernameInput, pages.login.form.passwordInput]
        for (const el of checkElements) {
          await expect(el).toContainClass(pages.login.form.inputErrorClass)
        }
      })
    }
  )

  test(
    `Failed Login with 'locked_out_user'`,
    { tag: [TAGS.DOC.DOCUMENTED, TAGS.STATUS.EXPECTED_TO_PASS] },
    async ({ pages, users, testData }) => {
      const user = users.LOCKED_OUT
      await test.step(`Log in as ${user.username}`, async () => {
        await pages.login.page.goto(pages.login.URL)
        await pages.login.fillAndSubmit(user)
      })
      await test.step(`Validate login error state`, async () => {
        await expect(pages.login.form.errorMessage).toBeVisible()
        await expect(pages.login.form.errorMessage).toHaveText(testData.loginErrors.LOCKED_USER)
        const checkElements = [pages.login.form.usernameInput, pages.login.form.passwordInput]
        for (const el of checkElements) {
          await expect(el).toContainClass(pages.login.form.inputErrorClass)
        }
      })
    }
  )

  test.describe(`With "standard_user"`, {}, () => {
    test.beforeEach(async ({ pages, users }) => {
      const user = users.STANDARD
      await test.step(`Login as ${user.username}`, async () => {
        await pages.login.page.goto(pages.login.URL)
        await pages.login.fillAndSubmit(user)
        await expect(pages.inventory.page).toHaveURL(pages.inventory.URL)
      })
    })

    // NOTE: this is an example implementation, test is expected to fail due to the nature of the application
    test(
      `Should not be able to proceed to checkout with empty cart`,
      { tag: [TAGS.DOC.NOT_DOCUMENTED, TAGS.STATUS.EXPECTED_TO_FAIL] },
      async ({ pages }) => {
        test.info().fail()
        await test.step(`Open cart`, async () => {
          await pages.inventory.header.headerPrimary.shoppingCart.click()
          await validatePageUrlAndHeaderTitle(pages.cart)
        })
        await test.step(`Validate Checkout button is disabled`, async () => {
          await expect(pages.cart.checkoutButton).toBeDisabled()
        })
      }
    )

    test(
      `Should not be able to proceed the checkout with empty shipping data`,
      { tag: [TAGS.DOC.NOT_DOCUMENTED, TAGS.STATUS.EXPECTED_TO_PASS] },
      async ({ pages, testData }) => {
        let randomItemDetails: ListItemDetails
        await test.step(`Add a randomly selected item to the cart`, async () => {
          randomItemDetails = await addRandomItemFromInventory(pages)
        })
        await test.step(`Open cart`, async () => {
          await pages.inventory.header.headerPrimary.shoppingCart.click()
          await validatePageUrlAndHeaderTitle(pages.cart)
        })
        await test.step(`Validate cart content`, async () => {
          await validateOneItemInCart(pages, randomItemDetails)
        })
        await test.step(`Proceed to checkout`, async () => {
          await pages.cart.checkoutButton.click()
          await validatePageUrlAndHeaderTitle(pages.checkoutOne)
        })
        await test.step(`Validate cannot proceed to checkout overview with empty shipping data`, async () => {
          const shippingData = testData.create.shipping()
          const errors = testData.checkoutErrors
          const form = pages.checkoutOne.form

          const validationSteps = [
            { input: form.firstNameInput, error: errors.FIRSTNAME_REQ, value: shippingData.firstName },
            { input: form.lastNameInput, error: errors.LASTNAME_REQ, value: shippingData.lastName },
            { input: form.postalInput, error: errors.POSTAL_REQ, value: shippingData.postal }
          ]
          await validateFormErrorSequence(pages.checkoutOne, pages.checkoutOne.continueButton, validationSteps)
          await pages.checkoutOne.continueButton.click()
          await validatePageUrlAndHeaderTitle(pages.checkoutTwo)
        })
      }
    )

    test.describe(``, { tag: [TAGS.DOC.DOCUMENTED, TAGS.STATUS.EXPECTED_TO_PASS] }, () => {
      test(`Successful Login`, async ({ pages }) => {
        await test.step(`Validate inventory page opened`, async () => {
          await expect(pages.inventory.header.container).toBeVisible()
          await expect(pages.inventory.items.container).toBeVisible()
          await expect(pages.inventory.header.headerSecondary.title).toHaveText(pages.inventory.headerTitle)
          await expect(pages.inventory.items.items.first()).toBeVisible()
        })
      })

      test(`Add a product to the cart`, async ({ pages }) => {
        let randomItemDetails: ListItemDetails
        await test.step(`Add a randomly selected item to the cart`, async () => {
          randomItemDetails = await addRandomItemFromInventory(pages)
        })
        await test.step(`Open cart`, async () => {
          await pages.inventory.header.headerPrimary.shoppingCart.click()
          await validatePageUrlAndHeaderTitle(pages.cart)
        })
        await test.step(`Validate cart content`, async () => {
          await validateOneItemInCart(pages, randomItemDetails)
        })
      })

      test(`Complete successful user journey`, async ({ pages, testData }) => {
        const shippingData = testData.create.shipping()
        const checkoutSuccess = testData.checkoutComplete.SUCCESS
        let randomItemDetails: ListItemDetails
        await test.step(`Add a randomly selected item to the cart`, async () => {
          randomItemDetails = await addRandomItemFromInventory(pages)
        })
        await test.step(`Open cart`, async () => {
          await pages.inventory.header.headerPrimary.shoppingCart.click()
          await validatePageUrlAndHeaderTitle(pages.cart)
        })
        await test.step(`Validate cart content`, async () => {
          await validateOneItemInCart(pages, randomItemDetails)
        })
        await test.step(`Proceed to checkout`, async () => {
          await pages.cart.checkoutButton.click()
          await validatePageUrlAndHeaderTitle(pages.checkoutOne)
        })
        await test.step(`Fill shipping details and proceed to checkout overview`, async () => {
          await pages.checkoutOne.fillAndSubmit(shippingData)
        })
        await test.step(`Validate checkout content `, async () => {
          await validatePageUrlAndHeaderTitle(pages.checkoutTwo)
          await expect(pages.checkoutTwo.items.items).toHaveCount(1)
          const checkoutItemDetails = await pages.checkoutTwo.items.getItemDetails(pages.checkoutTwo.items.itemByIndex(0))
          expect(checkoutItemDetails).toEqual({ ...randomItemDetails, quantity: '1' })
        })
        await test.step(`Finish checkout`, async () => {
          await pages.checkoutTwo.finishButton.click()
        })
        await test.step(`Validate checkout completion`, async () => {
          await validatePageUrlAndHeaderTitle(pages.checkoutComplete)
          await expect(pages.checkoutComplete.completeLogo).toBeVisible()
          await expect(pages.checkoutComplete.completeHeader).toHaveText(checkoutSuccess.HEADER)
          await expect(pages.checkoutComplete.completeText).toHaveText(checkoutSuccess.TEXT)
          //
        })
      })
    })
  })
})
