import type { Page } from '@playwright/test'
import { HeaderComponent, FooterComponent } from './components'

export abstract class BasePage {
  readonly page: Page
  abstract readonly URL: string
  readonly header: HeaderComponent
  readonly footer: FooterComponent

  constructor(page: Page) {
    this.page = page
    this.header = new HeaderComponent(page.getByTestId('header-container'))
    this.footer = new FooterComponent(page.getByTestId('footer'))
  }
}
