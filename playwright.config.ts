import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: '.env.hybrid' });

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 4, // Use 4 workers for local development
  
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results.json' }],
    ['junit', { outputFile: 'test-results.xml' }]
  ],
  
  use: {
    baseURL: process.env.BASE_URL_STAGING,
    screenshot: 'on',
    video: 'on',
    trace: 'on',
    actionTimeout: 10000,
    headless: process.env.MCP_HEADLESS === 'false',
  },

  // Proyectos para diferentes navegadores y dispositivos
  projects: [
    {
      name: 'Desktop Chrome',
      use: { 
        ...devices['Desktop Chrome'],
      },
    },
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    {
      name: 'Mobile Safari',
      use: { 
        ...devices['iPhone 12'],
        // Note: Safari doesn't support Chrome launch options
        // Test isolation is handled through other mechanisms
      },
    },
    // {
    //   name: 'Tablet',
    //   use: { ...devices['iPad Pro 11 landscape'] },
    // },
    // Proyecto especial para MCP integration
    // {
    //   name: 'mcp-debug',
    //   use: { 
    //     ...devices['Desktop Chrome'],
    //     headless: false
    //   },
    //   testDir: './tests',
    // },
  ],

  // webServer configuration removed since we're testing external URLs
});