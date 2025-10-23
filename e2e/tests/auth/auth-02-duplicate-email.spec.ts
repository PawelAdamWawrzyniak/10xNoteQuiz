import { test, expect } from '@playwright/test';
import { RegisterPage } from '../../page-objects/auth/register.page';
import { generateUniqueUser } from '../../fixtures/users';

/**
 * AUTH-02: Duplicate Email Registration E2E Tests
 *
 * Test Plan Reference: test-plan.md - AUTH-02
 * Scenario: User tries to register with an email that already exists
 * Expected: Error message "Użytkownik o tym adresie e-mail już istnieje"
 * Priority: High
 */
test.describe('AUTH-02: Duplicate Email Registration', () => {
  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
  });

  test('should show error when registering with already existing email', async ({ page }) => {
    // Arrange - Create a user first
    const user = generateUniqueUser();

    // Act - Register user for the first time
    await registerPage.navigate();
    await registerPage.register(user);

    // Assert - First registration succeeds
    await registerPage.expectSuccessMessage();
    await expect(page).toHaveURL(/\/auth\/register/);

    // Act - Navigate back to register page and try to register again with same email
    await registerPage.navigate();
    await registerPage.fillEmail(user.email);
    await registerPage.fillPassword(user.password);
    await registerPage.fillConfirmPassword(user.confirmPassword!);
    await registerPage.submit();

    // Assert - Error message is displayed
    await registerPage.expectErrorMessage();

    // Assert - Still on register page (not redirected)
    await expect(page).toHaveURL(/\/auth\/register/);

    // Assert - Form is still usable (not disabled)
    await registerPage.expectFormReady();
  });

  test('should show specific error message about duplicate email', async ({ page }) => {
    // Arrange - Create a user first
    const user = generateUniqueUser();

    // Act - First registration
    await registerPage.navigate();
    await registerPage.register(user);
    await registerPage.expectSuccessMessage();

    // Act - Second registration with same email
    await registerPage.navigate();
    await registerPage.register(user);

    // Assert - Specific error message about duplicate email
    // Note: Adjust the error message text to match your actual implementation
    const errorAlert = registerPage.errorAlert;
    await expect(errorAlert).toBeVisible();

    // The error message should mention the email already exists
    // Common variations: "już istnieje", "already exists", "email is already registered"
    const errorText = await errorAlert.textContent();
    expect(errorText?.toLowerCase()).toMatch(/już istnieje|already exists|already registered|already in use/);
  });

  test('should handle duplicate email with different password', async ({ page }) => {
    // Arrange - Create a user first
    const user = generateUniqueUser();

    // Act - First registration
    await registerPage.navigate();
    await registerPage.register(user);
    await registerPage.expectSuccessMessage();

    // Act - Try to register with same email but different password
    await registerPage.navigate();
    await registerPage.fillEmail(user.email);
    await registerPage.fillPassword('DifferentPassword123!');
    await registerPage.fillConfirmPassword('DifferentPassword123!');
    await registerPage.submit();

    // Assert - Should still show error (email is unique constraint)
    await registerPage.expectErrorMessage();
    await expect(page).toHaveURL(/\/auth\/register/);
  });

  test('should handle case sensitivity correctly for duplicate emails', async ({ page }) => {
    // Arrange - Create a user with lowercase email
    const user = generateUniqueUser();
    const lowercaseEmail = user.email.toLowerCase();

    // Act - Register with lowercase email
    await registerPage.navigate();
    await registerPage.fillEmail(lowercaseEmail);
    await registerPage.fillPassword(user.password);
    await registerPage.fillConfirmPassword(user.confirmPassword!);
    await registerPage.submit();
    await registerPage.expectSuccessMessage();

    // Act - Try to register with uppercase version of same email
    const uppercaseEmail = lowercaseEmail.toUpperCase();
    await registerPage.navigate();
    await registerPage.fillEmail(uppercaseEmail);
    await registerPage.fillPassword(user.password);
    await registerPage.fillConfirmPassword(user.confirmPassword!);
    await registerPage.submit();

    // Assert - Should show error (emails should be case-insensitive)
    // Note: This depends on your database/Supabase configuration
    // Most email systems treat emails as case-insensitive
    await registerPage.expectErrorMessage();
  });

  test('should handle email with extra whitespace', async ({ page }) => {
    // Arrange - Create a user
    const user = generateUniqueUser();

    // Act - Register with normal email
    await registerPage.navigate();
    await registerPage.register(user);
    await registerPage.expectSuccessMessage();

    // Act - Try to register with same email but with extra whitespace
    await registerPage.navigate();
    await registerPage.fillEmail(`  ${user.email}  `); // Email with spaces
    await registerPage.fillPassword(user.password);
    await registerPage.fillConfirmPassword(user.confirmPassword!);
    await registerPage.submit();

    // Assert - Should show error (email should be trimmed and detected as duplicate)
    // Note: This depends on your validation logic
    await registerPage.expectErrorMessage();
  });

  test('should allow user to correct email after duplicate error', async ({ page }) => {
    // Arrange - Create a user first
    const existingUser = generateUniqueUser();

    // Act - Register first user
    await registerPage.navigate();
    await registerPage.register(existingUser);
    await registerPage.expectSuccessMessage();

    // Act - Try to register with duplicate email
    await registerPage.navigate();
    await registerPage.register(existingUser);
    await registerPage.expectErrorMessage();

    // Act - Correct the email to a new unique one
    const newUser = generateUniqueUser();
    await registerPage.fillEmail(newUser.email);
    await registerPage.fillPassword(newUser.password);
    await registerPage.fillConfirmPassword(newUser.confirmPassword!);
    await registerPage.submit();

    // Assert - Should succeed with new email
    await registerPage.expectSuccessMessage();
    await expect(page).toHaveURL(/\/auth\/register/);
  });

  test('should not expose existing user information in error message', async ({ page }) => {
    // Arrange - Create a user
    const user = generateUniqueUser();

    // Act - Register user
    await registerPage.navigate();
    await registerPage.register(user);
    await registerPage.expectSuccessMessage();

    // Act - Try to register again
    await registerPage.navigate();
    await registerPage.register(user);

    // Assert - Error message should not contain sensitive information
    const errorAlert = registerPage.errorAlert;
    await expect(errorAlert).toBeVisible();

    const errorText = await errorAlert.textContent();

    // Error should not contain user's password, full email details, etc.
    // It should be generic like "Email already exists" not "User john@example.com exists"
    expect(errorText).not.toContain(user.password);

    // The error should be informative but not reveal too much
    expect(errorText?.length).toBeGreaterThan(10); // Has some message
    expect(errorText?.length).toBeLessThan(200); // But not overly detailed
  });
});

/**
 * AUTH-02: Edge Cases and Security
 */
test.describe('AUTH-02: Duplicate Email Edge Cases', () => {
  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
  });

  test('should prevent rapid duplicate registration attempts', async ({ page }) => {
    // Arrange
    const user = generateUniqueUser();

    // Act - Register user once
    await registerPage.navigate();
    await registerPage.register(user);
    await registerPage.expectSuccessMessage();

    // Act - Rapidly try to register 3 more times with same email
    for (let i = 0; i < 3; i++) {
      await registerPage.navigate();
      await registerPage.register(user);

      // Assert - Each attempt should fail with error
      await registerPage.expectErrorMessage();
    }

    // Assert - Application should remain stable
    await expect(page).toHaveURL(/\/auth\/register/);
    await registerPage.expectFormReady();
  });

  test('should handle duplicate email after failed first registration', async ({ page }) => {
    // Arrange
    const user = generateUniqueUser();

    // Act - First registration with mismatched passwords (should fail validation)
    await registerPage.navigate();
    await registerPage.fillEmail(user.email);
    await registerPage.fillPassword(user.password);
    await registerPage.fillConfirmPassword('WrongPassword123!');
    await registerPage.submit();

    // Assert - Validation error (passwords don't match)
    await registerPage.expectFieldError('confirmPassword', 'Hasła nie są zgodne');

    // Act - Fix password and register successfully
    await registerPage.fillConfirmPassword(user.confirmPassword!);
    await registerPage.submit();

    // Assert - Registration succeeds
    await registerPage.expectSuccessMessage();

    // Act - Try to register again with same email
    await registerPage.navigate();
    await registerPage.register(user);

    // Assert - Should show duplicate email error
    await registerPage.expectErrorMessage();
  });
});