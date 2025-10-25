import { type Page, type Locator, expect } from "@playwright/test";
import type { Credentials } from "../../fixtures/users";

/**
 * Page Object Model for Login Page
 * Encapsulates all interactions with /auth/login
 */
export class LoginPage {
  readonly page: Page;

  // Locators - Using semantic selectors (labels, roles, text)
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorAlert: Locator;
  readonly registerLink: Locator;
  readonly pageTitle: Locator;
  readonly pageDescription: Locator;

  constructor(page: Page) {
    this.page = page;

    // Form fields - using label text for accessibility
    this.emailInput = page.getByLabel("Adres e-mail");
    this.passwordInput = page.getByLabel("Hasło");

    // Buttons
    this.submitButton = page.getByRole("button", { name: /zaloguj się/i });

    // Error elements
    this.errorAlert = page.getByRole("alert");

    // Navigation
    this.registerLink = page.getByRole("link", { name: /zarejestruj się/i });

    // Page content
    this.pageTitle = page.getByRole("heading", { name: /witaj ponownie/i });
    this.pageDescription = page.getByText(/zaloguj się, aby kontynuować/i);
  }

  /**
   * Navigate to the login page
   */
  async navigate() {
    await this.page.goto("/auth/login");
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Fill the email field
   */
  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  /**
   * Fill the password field
   */
  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  /**
   * Click the submit button
   */
  async submit() {
    await this.submitButton.click();
  }

  /**
   * Complete login flow with credentials
   * This is the main action method for login tests
   */
  async login(credentials: Credentials) {
    await this.fillEmail(credentials.email);
    await this.fillPassword(credentials.password);
    await this.submit();
  }

  /**
   * Verify successful login by checking redirect to /notes
   */
  async expectSuccessfulLogin() {
    // Wait for redirect to notes page
    await expect(this.page).toHaveURL(/\/notes/, { timeout: 10000 });
  }

  /**
   * Verify error alert is displayed
   */
  async expectErrorMessage(message?: string) {
    await expect(this.errorAlert).toBeVisible();
    if (message) {
      await expect(this.errorAlert).toContainText(message);
    }
  }

  /**
   * Verify field-level error message
   */
  async expectFieldError(fieldName: string, errorMessage: string) {
    const errorText = this.page.locator(".text-sm.text-red-500", { hasText: errorMessage });
    await expect(errorText).toBeVisible();
  }

  /**
   * Verify the form is in loading state
   */
  async expectLoadingState() {
    await expect(this.submitButton).toBeDisabled();
    await expect(this.submitButton).toContainText(/logowanie/i);
  }

  /**
   * Verify the form is ready for input
   */
  async expectFormReady() {
    await expect(this.emailInput).toBeEnabled();
    await expect(this.passwordInput).toBeEnabled();
    await expect(this.submitButton).toBeEnabled();
  }

  /**
   * Click "Register" link to navigate to registration page
   */
  async goToRegister() {
    await this.registerLink.click();
  }

  /**
   * Verify page title and description are visible
   */
  async expectPageContentVisible() {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.pageDescription).toBeVisible();
  }

  /**
   * Get the current URL
   */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Wait for toast notification with specific message
   * Useful for validating success/error toasts
   */
  async expectToast(message: string) {
    const toast = this.page.locator("[data-sonner-toast]", { hasText: message });
    await expect(toast).toBeVisible({ timeout: 5000 });
  }

  /**
   * Wait for success toast after login
   */
  async expectSuccessToast() {
    await this.expectToast("Zalogowano pomyślnie!");
  }

  /**
   * Wait for error toast
   */
  async expectErrorToast(message?: string) {
    if (message) {
      await this.expectToast(message);
    } else {
      // Wait for any error toast
      const errorToast = this.page.locator('[data-sonner-toast][data-type="error"]');
      await expect(errorToast).toBeVisible({ timeout: 5000 });
    }
  }
}
