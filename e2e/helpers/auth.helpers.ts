import { type Page } from "@playwright/test";
import { RegisterPage } from "../page-objects/auth/register.page";
import { LoginPage } from "../page-objects/auth/login.page";
import type { TestUser } from "../fixtures/users";
import { generateUniqueUser } from "../fixtures/users";

/**
 * Authentication Helper Utilities
 * Reusable functions for common authentication flows in E2E tests
 */

/**
 * Complete user registration flow
 * Navigates to registration page, fills form, submits, and waits for success
 *
 * @param page - Playwright page object
 * @param user - Optional user data (generates unique user if not provided)
 * @returns The user credentials that were registered
 */
export async function registerUser(page: Page, user?: TestUser): Promise<TestUser> {
  const userData = user || generateUniqueUser();
  const registerPage = new RegisterPage(page);

  await registerPage.navigate();
  await registerPage.register(userData);
  await registerPage.expectSuccessMessage();

  return userData;
}

/**
 * Complete login flow
 * Navigates to login page, fills credentials, submits, and waits for redirect
 *
 * @param page - Playwright page object
 * @param email - User email
 * @param password - User password
 */
export async function loginUser(page: Page, email: string, password: string): Promise<void> {
  const loginPage = new LoginPage(page);

  await loginPage.navigate();
  await loginPage.login({ email, password });
  await loginPage.expectSuccessfulLogin();
}

/**
 * Complete registration and login flow
 * Creates a new user, registers them, then logs them in
 *
 * @param page - Playwright page object
 * @param user - Optional user data (generates unique user if not provided)
 * @returns The user credentials that were created
 */
export async function registerAndLoginUser(page: Page, user?: TestUser): Promise<TestUser> {
  const userData = await registerUser(page, user);

  // After successful registration, navigate to login and authenticate
  await loginUser(page, userData.email, userData.password);

  return userData;
}

/**
 * Setup an authenticated session for tests
 * Quick utility to get a logged-in user state for tests that need authentication
 *
 * @param page - Playwright page object
 * @returns The authenticated user credentials
 */
export async function setupAuthenticatedSession(page: Page): Promise<TestUser> {
  return await registerAndLoginUser(page);
}

/**
 * Verify user is authenticated by checking for authenticated-only elements
 *
 * @param page - Playwright page object
 * @returns true if user appears to be authenticated
 */
export async function isAuthenticated(page: Page): Promise<boolean> {
  try {
    // Check if we're on a protected page (notes page)
    const url = page.url();
    if (!url.includes("/notes")) {
      return false;
    }

    // Check for authenticated-only elements
    const logoutButton = page.getByRole("button", { name: /wyloguj/i });
    const isVisible = await logoutButton.isVisible({ timeout: 2000 });
    return isVisible;
  } catch {
    return false;
  }
}

/**
 * Logout the current user
 * Clicks logout button and waits for redirect to login/home page
 *
 * @param page - Playwright page object
 */
export async function logoutUser(page: Page): Promise<void> {
  const logoutButton = page.getByRole("button", { name: /wyloguj/i });
  await logoutButton.click();

  // Wait for redirect after logout
  await page.waitForURL(/\/(auth\/login)?$/, { timeout: 5000 });
}

/**
 * Navigate directly to a protected route (for testing redirect behavior)
 *
 * @param page - Playwright page object
 * @param route - The protected route to navigate to (e.g., '/notes')
 */
export async function navigateToProtectedRoute(page: Page, route: string): Promise<void> {
  await page.goto(route);
}
