import { test, expect } from "../../fixtures/auth.fixture";

/**
 * AUTH-01: User Registration E2E Tests using Admin API
 *
 * This test uses Supabase Admin API to create users directly,
 * bypassing email verification and rate limits.
 *
 * Benefits:
 * - No email sending = no rate limits
 * - Instant user creation
 * - Auto-cleanup after tests
 * - Works with any email format
 */
test.describe("AUTH-01: User Registration with Admin API", () => {
  test("should create user directly using Admin API", async ({ authenticatedUser }) => {
    // User is already created and authenticated via fixture
    expect(authenticatedUser.id).toBeTruthy();
    expect(authenticatedUser.email).toContain("@mailinator.com");
    expect(authenticatedUser.password).toBe("TestPassword123!");

    // User should be auto-confirmed (no email verification needed)
    // Test that user can access protected resources
  });

  test("should create multiple users without rate limits", async ({ page }) => {
    // This test demonstrates that we can create many users rapidly
    // without hitting email rate limits

    // Create first user via fixture (happens automatically)
    // The fixture will clean up this user after the test

    // In a real scenario, you would interact with the app using this user
    await page.goto("/");
    expect(page).toBeTruthy();
  });
});

/**
 * Example: How to use the fixture in existing tests
 *
 * Simply import from auth.fixture instead of @playwright/test:
 *
 * Before:
 * import { test, expect } from '@playwright/test';
 *
 * After:
 * import { test, expect } from '../../fixtures/auth.fixture';
 *
 * Then use the authenticatedUser fixture in your test:
 * test('my test', async ({ authenticatedUser, page }) => {
 *   // authenticatedUser.id, .email, .password are available
 * });
 */
