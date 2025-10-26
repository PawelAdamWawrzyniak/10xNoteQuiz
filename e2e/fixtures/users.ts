/**
 * Test User Data Fixtures
 * Provides reusable test user data for E2E tests
 */

export interface TestUser {
  email: string;
  password: string;
  confirmPassword?: string;
}

/**
 * Generates a unique user with timestamp and random string to avoid conflicts
 * Use this for tests that create new users
 */
export function generateUniqueUser(): TestUser {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);

  // Use a real test email domain that Supabase accepts
  // Options:
  // 1. mailinator.com - public disposable emails (recommended for CI)
  // 2. Gmail plus addressing - uses your real email with +suffix
  // 3. Your own domain with catch-all

  // For local testing, you can use Gmail plus addressing:
  // const baseEmail = process.env.E2E_USERNAME || 'your-email@gmail.com';
  // const email = baseEmail.replace('@', `+test-${timestamp}-${random}@`);

  // For CI testing, use mailinator (no email delivery needed):
  const email = `test-${timestamp}-${random}@mailinator.com`;

  return {
    email,
    password: "TestPassword123!",
    confirmPassword: "TestPassword123!",
  };
}

/**
 * Pre-defined test users for specific scenarios
 * NOTE: Use generateUniqueUser() instead for registration tests to avoid conflicts
 */
export const testUsers = {
  /**
   * Valid user data for testing successful flows
   */
  valid: {
    email: "valid.user@example.com",
    password: "ValidPassword123!",
    confirmPassword: "ValidPassword123!",
  },

  /**
   * User with invalid email format
   */
  invalidEmail: {
    email: "invalid-email-format",
    password: "TestPassword123!",
    confirmPassword: "TestPassword123!",
  },

  /**
   * User with weak password (too short)
   */
  weakPassword: {
    email: "weak@example.com",
    password: "123",
    confirmPassword: "123",
  },

  /**
   * User with mismatched passwords
   */
  mismatchedPasswords: {
    email: "mismatch@example.com",
    password: "TestPassword123!",
    confirmPassword: "DifferentPassword456!",
  },

  /**
   * User with empty fields
   */
  emptyFields: {
    email: "",
    password: "",
    confirmPassword: "",
  },

  /**
   * User with password missing uppercase
   */
  noUppercasePassword: {
    email: "test@example.com",
    password: "testpassword123!",
    confirmPassword: "testpassword123!",
  },

  /**
   * User with password missing number
   */
  noNumberPassword: {
    email: "test@example.com",
    password: "TestPassword!",
    confirmPassword: "TestPassword!",
  },
};

/**
 * Credentials interface for login scenarios
 */
export interface Credentials {
  email: string;
  password: string;
}

/**
 * Generate multiple unique users for bulk testing
 */
export function generateMultipleUsers(count: number): TestUser[] {
  return Array.from({ length: count }, () => generateUniqueUser());
}
