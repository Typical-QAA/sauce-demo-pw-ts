import type { Locator } from '@playwright/test'

class Social {
  readonly container: Locator
  readonly twitter: Locator
  readonly facebook: Locator
  readonly linkedin: Locator

  constructor(container: Locator) {
    this.container = container
    this.twitter = this.container.locator('li.social_twitter')
    this.facebook = this.container.locator('li.social_tacebook')
    this.linkedin = this.container.locator('li.social_linkedin')
  }
}

export class FooterComponent {
  readonly container: Locator
  readonly social: Social
  readonly copyright: Locator

  constructor(container: Locator) {
    this.container = container
    this.social = new Social(this.container.locator('ul.social'))
    this.copyright = this.container.getByTestId('footer-copy')
  }
}
