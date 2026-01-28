import { expect, Locator, Page } from '@playwright/test'
import type { AllFixtures } from '../fixtures'
import type { ListItemDetails } from '../types'

type PagesFixtures = AllFixtures['pages']
type PageWithHeader = { page: Page; URL: string; headerTitle: string; header: { headerSecondary: { title: Locator } } }
type PageWithForm = { form: { errorMessage: Locator; inputErrorClass: string } }

export async function validatePageUrlAndHeaderTitle(pageObject: PageWithHeader) {
  await expect(pageObject.page).toHaveURL(pageObject.URL)
  await expect(pageObject.header.headerSecondary.title).toHaveText(pageObject.headerTitle)
}

export async function addRandomItemFromInventory(pages: PagesFixtures): Promise<ListItemDetails> {
  const { inventory } = pages

  await expect(inventory.items.items.first()).toBeVisible()
  const allItems = await inventory.items.items.all()
  expect(allItems.length).toBeGreaterThan(0)
  const randomItem = inventory.items.itemByIndex(Math.floor(Math.random() * allItems.length))
  const details = await inventory.items.getItemDetails(randomItem)
  await randomItem.addButton.click()

  return details
}

export async function validateOneItemInCart(pages: PagesFixtures, itemDetails: ListItemDetails) {
  const { cart } = pages

  await expect(cart.header.headerPrimary.shoppingBadge).toHaveText('1')
  await expect(cart.items.items).toHaveCount(1)
  const cartItemDetails = await pages.cart.items.getItemDetails(pages.cart.items.itemByIndex(0))
  expect(cartItemDetails).toEqual({ ...itemDetails, quantity: '1' })
}

export async function validateFormErrorSequence(
  pageObject: PageWithForm,
  submitButton: Locator,
  validationSteps: { input: Locator; error: string; value: string }[]
) {
  for (let i = 0; i < validationSteps.length; i++) {
    await submitButton.click()
    await expect(pageObject.form.errorMessage).toHaveText(validationSteps[i].error)
    for (const step of validationSteps) {
      await expect(step.input).toContainClass(pageObject.form.inputErrorClass)
    }
    await validationSteps[i].input.fill(validationSteps[i].value)
  }
}
