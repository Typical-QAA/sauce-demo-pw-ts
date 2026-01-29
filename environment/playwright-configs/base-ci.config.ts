// @ts-check
import { defineConfig, devices } from '@playwright/test'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../../.env'), quiet: true })

export default defineConfig({
  testDir: path.resolve(__dirname, '../../tests'),
  fullyParallel: true,
  retries: 0, // NOTE: disable retries for immediate feedback on CI failures
  workers: 2, // NOTE: only two workers to avoid possible rate limiting
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: path.resolve(__dirname, '../../playwright-report/html/ci') }],
    ['junit', { outputFile: path.resolve(__dirname, '../../playwright-report/junit/results.xml') }],
    ['json', { outputFile: path.resolve(__dirname, '../../playwright-report/json/results.json') }],
    ['allure-playwright']
  ],
  use: {
    baseURL: process.env.PW_BASE_URL || '',
    testIdAttribute: 'data-test',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    acceptDownloads: true
  },

  projects: [
    {
      name: 'web',
      testDir: path.resolve(__dirname, '../../tests'),
      testMatch: '**/*.spec.ts',
      use: { ...devices['Desktop Chrome'], channel: 'chromium', baseURL: process.env.PW_BASE_WEB_URL || 'https://www.saucedemo.com' }
    }
  ]
})
