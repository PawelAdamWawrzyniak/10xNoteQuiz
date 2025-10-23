import { type Page, type Locator, expect } from '@playwright/test';
import type { TestUser } from '../../fixtures/users';

/**
 * Page Object Model for Registration Page
 * Encapsulates all interactions with /auth/register
 */
export class RegisterPage {
  readonly page: Page;

  // Locators - Using semantic selectors (labels, roles, text)
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly submitButton: Locator;
  readonly successCard: Locator;
  readonly successTitle: Locator;
  readonly successMessage: Locator;
  readonly goToLoginLink: Locator;
  readonly errorAlert: Locator;
  readonly loginLink: Locator;

  constructor(page: Page) {
    this.page = page;

    // Form fields - using label text for accessibility
    this.emailInput = page.getByLabel('Adres e-mail');
    this.passwordInput = page.getByLabel('Hasło', { exact: true });
    this.confirmPasswordInput = page.getByLabel('Potwierdź hasło');

    // Buttons
    this.submitButton = page.getByRole('button', { name: /zarejestruj się/i });

    // Success state elements
    // The success card is the parent Card component containing the success message
    this.successCard = page.locator('div').filter({ hasText: 'Rejestracja pomyślna!' }).first();
    this.successTitle = page.getByText('Rejestracja pomyślna!', { exact: true });
    this.successMessage = page.getByRole('alert').getByText(/konto utworzone/i).first();
    this.goToLoginLink = page.getByRole('link', { name: /przejdź do logowania/i });

    // Error elements
    this.errorAlert = page.getByRole('alert');

    // Navigation
    this.loginLink = page.getByRole('link', { name: /zaloguj się/i });
  }

  /**
   * Navigate to the registration page
   */
  async navigate() {
    await this.page.goto('/auth/register');
    await this.page.waitForLoadState('networkidle');
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
   * Fill the confirm password field
   */
  async fillConfirmPassword(password: string) {
    await this.confirmPasswordInput.fill(password);
  }

  /**
   * Click the submit button
   */
  async submit() {
    await this.submitButton.click();
  }

  /**
   * Complete registration flow with all fields
   * This is the main action method for happy path tests
   */
  async register(user: TestUser) {
    await this.fillEmail(user.email);
    await this.fillPassword(user.password);
    await this.fillConfirmPassword(user.confirmPassword || user.password);
    await this.submit();
  }

  /**
   * Wait for and verify success message is displayed
   */
  async expectSuccessMessage() {
    await expect(this.successTitle).toBeVisible();
    await expect(this.successMessage).toBeVisible();
  }

  /**
   * Verify the success card is shown
   */
  async expectSuccessCard() {
    await expect(this.successCard).toBeVisible();
  }

  /**
   * Verify error alert is displayed with specific message
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
    const errorText = this.page.locator('.text-sm.text-red-500', { hasText: errorMessage });
    await expect(errorText).toBeVisible();
  }

  /**
   * Click "Go to Login" link after successful registration
   */
  async goToLogin() {
    await this.goToLoginLink.click();
  }

  /**
   * Verify the form is in loading state
   */
  async expectLoadingState() {
    await expect(this.submitButton).toBeDisabled();
    await expect(this.submitButton).toContainText(/rejestrowanie/i);
  }

  /**
   * Verify the form is ready for input
   */
  async expectFormReady() {
    await expect(this.emailInput).toBeEnabled();
    await expect(this.passwordInput).toBeEnabled();
    await expect(this.confirmPasswordInput).toBeEnabled();
    await expect(this.submitButton).toBeEnabled();
  }
}