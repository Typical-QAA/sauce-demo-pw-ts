import type { Locator } from '@playwright/test'

export class InputsForm {
  readonly container: Locator
  readonly errorMessage: Locator
  readonly inputErrorClass: string

  constructor(container: Locator) {
    this.container = container
    this.errorMessage = this.container.getByTestId('error')
    this.inputErrorClass = 'input_error'
  }
}
