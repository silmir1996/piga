import { Page } from '@playwright/test';
import { users } from './users';

/**
 * Login to the application with the specified user
 * @param page - Playwright page object
 * @param userEmail - The user email to login with (from users object)
 */
export async function login(page: Page, userEmail: string) {
  await page.goto('/');
  await page.getByRole('textbox', { name: 'Correo electrónico' }).fill(userEmail);
  await page.getByRole('textbox', { name: 'Contraseña' }).fill(users.password);
  await page.getByRole('button', { name: 'Iniciar sesión' }).click();
}

/**
 * Login with a specific user type (predefined combinations)
 * @param page - Playwright page object
 * @param userType - The type of user to login with
 */
export async function loginWithUserType(page: Page, userType: keyof typeof users) {
  await login(page, users[userType]);
} 