import type { Locator, Page } from '@playwright/test'
import type { UserDataCredentials } from '../types'
import { BasePage } from './base-page'
import { InputsForm } from './components'

class Form extends InputsForm {
  readonly container: Locator
  readonly usernameInput: Locator
  readonly passwordInput: Locator

  constructor(container: Locator) {
    super(container)
    this.container = container

    this.usernameInput = this.container.getByTestId('username')
    this.passwordInput = this.container.getByTestId('password')
  }
}

export class LoginPage extends BasePage {
  readonly URL = '/'
  readonly container: Locator
  readonly form: Form
  readonly loginButton: Locator

  constructor(page: Page) {
    super(page)
    this.container = page.locator('#root')
    this.form = new Form(page.getByTestId('login-container'))
    this.loginButton = this.container.getByTestId('login-button')
  }

  async fillAndSubmit(user: UserDataCredentials) {
    await this.form.usernameInput.fill(user.username)
    await this.form.passwordInput.fill(user.password)
    await this.loginButton.click()
  }
}
