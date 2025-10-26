# E2E Test Fixtures

## Auth Fixture - Admin API User Creation

### Problem It Solves

When running E2E tests that create users via normal registration flow:
- ❌ Supabase sends confirmation emails
- ❌ Email rate limits (3-4 per hour on free tier)
- ❌ Tests fail in CI with "rate limit exceeded"
- ❌ Slow test execution waiting for emails

### Solution: Admin API Direct User Creation

The `auth.fixture.ts` uses Supabase Admin API to:
- ✅ Create users directly (no emails sent)
- ✅ No rate limits
- ✅ Auto-confirm emails
- ✅ Automatic cleanup after tests
- ✅ Fast and reliable

### Setup

1. **Install dotenv (if not already installed):**
   ```bash
   npm install --save-dev dotenv
   ```

   Already configured in `playwright.config.ts` to load `.env` file automatically.

2. **Get Service Role Key from Supabase:**
   - Go to Supabase Dashboard → Settings → API
   - Copy the `service_role` key (NOT the `anon` key)
   - ⚠️ **IMPORTANT**: Keep this secret! It has admin privileges

   **For local Supabase:**
   - Service role key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU`

3. **Add to local `.env`:**
   ```bash
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

4. **Add to GitHub Secrets:**
   - Go to GitHub repo → Settings → Secrets and variables → Actions
   - Add new secret: `SUPABASE_SERVICE_ROLE_KEY`
   - Paste your service role key

### Usage

#### Basic Usage

```typescript
import { test, expect } from "../../fixtures/auth.fixture";

test("my test", async ({ authenticatedUser, page }) => {
  // User is already created and authenticated
  console.log(authenticatedUser.id);       // User ID
  console.log(authenticatedUser.email);    // test-123456789@mailinator.com
  console.log(authenticatedUser.password); // TestPassword123!

  // Use the user in your test
  await page.goto("/dashboard");
  // ... test logic
});
// User is automatically deleted after test finishes
```

#### Without Automatic Authentication

If you just need a user created but want to handle login yourself:

```typescript
import { test, expect } from "../../fixtures/auth.fixture";

test("manual login test", async ({ authenticatedUser, page }) => {
  // User exists in database, now login manually
  await page.goto("/auth/login");
  await page.fill("#email", authenticatedUser.email);
  await page.fill("#password", authenticatedUser.password);
  await page.click('button[type="submit"]');

  // Continue with test
});
```

#### Testing Registration Flow (without creating user)

For tests that need to test the registration UI itself, use the old approach but with `@mailinator.com`:

```typescript
import { test, expect } from "@playwright/test";

test("registration UI test", async ({ page }) => {
  await page.goto("/auth/register");

  // Use mailinator email (accepted by Supabase)
  const email = `test-${Date.now()}@mailinator.com`;

  await page.fill("#email", email);
  await page.fill("#password", "TestPassword123!");
  await page.fill("#confirmPassword", "TestPassword123!");
  await page.click('button[type="submit"]');

  // Assert registration flow
});
```

### How It Works

1. **Before Test**: Fixture creates user via `supabase.auth.admin.createUser()`
   - No email sent
   - Email auto-confirmed
   - Returns user credentials

2. **During Test**: User data available as `authenticatedUser` fixture

3. **After Test**: Fixture deletes user via `supabase.auth.admin.deleteUser()`
   - Automatic cleanup
   - No leftover test data

### Migration Guide

#### Before (Old Approach - Hit Rate Limits):
```typescript
import { test, expect } from "@playwright/test";
import { generateUniqueUser } from "../../fixtures/users";

test("my test", async ({ page }) => {
  const user = generateUniqueUser(); // Generates random email

  await page.goto("/auth/register");
  await page.fill("#email", user.email);
  await page.fill("#password", user.password);
  await page.click('button[type="submit"]');
  // ❌ This sends an email → rate limits!
});
```

#### After (New Approach - No Rate Limits):
```typescript
import { test, expect } from "../../fixtures/auth.fixture";

test("my test", async ({ authenticatedUser, page }) => {
  // ✅ User already exists, no email sent!
  await page.goto("/dashboard");
  // User is authenticated and ready to use
});
```

### Benefits

| Old Approach | New Approach (Admin API) |
|-------------|-------------------------|
| ❌ Sends emails | ✅ No emails |
| ❌ Rate limits | ✅ No rate limits |
| ❌ Slow (email delays) | ✅ Fast (instant) |
| ❌ Manual cleanup | ✅ Auto cleanup |
| ❌ CI failures | ✅ Reliable in CI |

### Security Notes

⚠️ **Service Role Key Security:**
- Never commit service role key to git
- Only use in tests (never in production code)
- Store in environment variables
- GitHub Secrets for CI/CD
- Has full admin access to Supabase

### Troubleshooting

**Error: "Missing SUPABASE_SERVICE_ROLE_KEY"**
- Solution: Add the key to `.env.test` locally and GitHub Secrets for CI

**Error: "Failed to create test user"**
- Check that service role key is correct
- Verify Supabase project is accessible
- Check network connectivity

**Users not cleaned up after tests**
- The fixture has automatic cleanup in `finally` block
- If tests crash, some users might remain
- Manually delete from Supabase Dashboard → Authentication → Users

### When to Use Which Approach

| Use Case | Approach |
|----------|----------|
| Testing with authenticated user | ✅ Use `auth.fixture.ts` |
| Testing login flow | ❌ Create user manually with Admin API first |
| Testing registration UI | ❌ Use manual registration with `@mailinator.com` |
| Testing user-specific features | ✅ Use `auth.fixture.ts` |
| Load testing (many users) | ✅ Use `auth.fixture.ts` |

### Example: Complete Test File

```typescript
import { test, expect } from "../../fixtures/auth.fixture";

test.describe("Dashboard Tests", () => {
  test("user can view their dashboard", async ({ authenticatedUser, page }) => {
    await page.goto("/dashboard");

    // User is authenticated automatically
    await expect(page.getByText(authenticatedUser.email)).toBeVisible();
  });

  test("user can create a note", async ({ authenticatedUser, page }) => {
    await page.goto("/notes/new");

    await page.fill("#title", "Test Note");
    await page.fill("#content", "Test content");
    await page.click('button[type="submit"]');

    await expect(page.getByText("Test Note")).toBeVisible();
  });
});
```