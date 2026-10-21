import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: 'tests/e2e', fullyParallel: true, timeout: 60000, workers: 3,
  use: { baseURL: 'http://127.0.0.1:4325', trace: 'retain-on-failure' },
  projects: [{ name: 'desktop', use: { ...devices['Desktop Chrome'] } }, { name: 'mobile', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' } }],
  webServer: { command: 'npm run preview -- --port 4325', url: 'http://127.0.0.1:4325', reuseExistingServer: false },
});
