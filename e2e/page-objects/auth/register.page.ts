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

    // Form fields - KEEP semantic selectors for accessibility
    this.emailInput = page.getByLabel('Adres e-mail');
    this.passwordInput = page.getByLabel('Hasło', { exact: true });
    this.confirmPasswordInput = page.getByLabel('Potwierdź hasło');

    // Buttons - KEEP semantic selectors
    this.submitButton = page.getByRole('button', { name: /zarejestruj się/i });

    // Success state elements - USE data-testid for reliability
    this.successCard = page.getByTestId('register-success-card');
    this.successTitle = page.getByTestId('register-success-title');
    this.successMessage = page.getByTestId('register-success-alert-description');
    this.goToLoginLink = page.getByRole('link', { name: /przejdź do logowania/i });

    // Error elements - USE data-testid for specificity
    this.errorAlert = page.getByTestId('register-error-alert');

    // Navigation - KEEP semantic selectors
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
   * Get field error element by field name using data-testid
   */
  getFieldError(fieldName: string): Locator {
    return this.page.getByTestId(`register-field-error-${fieldName}`);
  }

  /**
   * Verify field-level error message
   */
  async expectFieldError(fieldName: string, errorMessage?: string) {
    const errorElement = this.getFieldError(fieldName);
    await expect(errorElement).toBeVisible();
    if (errorMessage) {
      await expect(errorElement).toContainText(errorMessage);
    }
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