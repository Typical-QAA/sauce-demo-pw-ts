// @ts-check
import { defineConfig, devices } from '@playwright/test'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '.env'), quiet: true })

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: 0,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never', outputFolder: './playwright-report/html/local' }]],
  use: { testIdAttribute: 'data-test', trace: 'on-first-retry', video: 'retain-on-failure', acceptDownloads: true },

  projects: [
    {
      name: 'web',
      testDir: './tests',
      testMatch: '**/*.spec.ts',
      use: { ...devices['Desktop Chrome'], baseURL: process.env.PW_BASE_WEB_URL || 'https://www.saucedemo.com' }
    }
  ]
})
