# E2E Test Fixtures

## Admin API User Creation - Two Approaches

### Problem It Solves

When running E2E tests that create users via normal registration flow:

- ❌ Supabase sends confirmation emails
- ❌ Email rate limits (3-4 per hour on free tier)
- ❌ Slow test execution waiting for emails
- ❌ Tests fail in CI with "rate limit exceeded"

### Solution: Admin API Direct User Creation

We provide **two approaches** for using Supabase Admin API to create test users:

#### Approach A: Fixture-Based (Automatic) - `auth.fixture.ts`

**Best for:** Tests needing authenticated users automatically

- ✅ Fully automatic user creation and cleanup
- ✅ Session automatically set in browser
- ✅ Zero boilerplate code
- ✅ Perfect for authenticated user flows

#### Approach B: Page Object-Based (Manual Control) - `RegisterByAuthPage`

**Best for:** Tests needing precise control over user creation timing

- ✅ Create users exactly when needed
- ✅ Test duplicate email scenarios
- ✅ Test registration validation logic
- ✅ More flexible for complex test scenarios

Both approaches:

- ✅ No emails sent (no rate limits)
- ✅ Auto-confirm emails
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

## Approach A: Fixture-Based (Automatic)

**Use when:** Testing authenticated user flows (dashboard, user features, protected routes)

#### Basic Usage

```typescript
import { test, expect } from "../../fixtures/auth.fixture";

test("my test", async ({ authenticatedUser, page }) => {
  // User is already created and authenticated
  console.log(authenticatedUser.id); // User ID
  console.log(authenticatedUser.email); // test-123456789@mailinator.com
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

## Approach B: Page Object-Based (Manual Control)

**Use when:** Testing registration logic, duplicate emails, validation errors

#### Testing Duplicate Email Detection

```typescript
import { test, expect } from "@playwright/test";
import { RegisterByAuthPage } from "../../page-objects/auth/register-by-auth.page";
import { generateUniqueUser } from "../../fixtures/users";

test.describe("Duplicate Email Tests", () => {
  let registerPage: RegisterByAuthPage;
  const userIdsToCleanup: string[] = [];

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterByAuthPage(page);
  });

  test.afterEach(async () => {
    // Manual cleanup
    for (const userId of userIdsToCleanup) {
      await registerPage.adminDeleteUser(userId);
    }
    userIdsToCleanup.length = 0;
  });

  test("should show error for duplicate email", async ({ page }) => {
    // Create user via Admin API first
    const user = generateUniqueUser();
    const userId = await registerPage.adminRegister(user);
    userIdsToCleanup.push(userId);

    // Now try to register via UI with same email
    await registerPage.navigate();
    await registerPage.register(user);

    // Assert error is shown
    await registerPage.expectErrorMessage();
  });
});
```

#### Testing Registration UI Flow (without Admin API)

For tests that need to test the complete registration UI flow:

```typescript
import { test, expect } from "@playwright/test";
import { RegisterPage } from "../../page-objects/auth/register.page";
import { generateUniqueUser } from "../../fixtures/users";

test("registration UI test", async ({ page }) => {
  const registerPage = new RegisterPage(page);
  await registerPage.navigate();

  // Use unique email (mailinator accepted by Supabase)
  const user = generateUniqueUser();

  await registerPage.fillEmail(user.email);
  await registerPage.fillPassword(user.password);
  await registerPage.fillConfirmPassword(user.password);
  await registerPage.submit();

  // Assert registration success
  await registerPage.expectSuccessMessage();
});
```

### How They Work

#### Approach A: auth.fixture.ts (Automatic)

1. **Before Test**: Fixture creates user via `supabase.auth.admin.createUser()`
   - No email sent
   - Email auto-confirmed
   - Session set in browser
   - Returns user credentials

2. **During Test**: User data available as `authenticatedUser` fixture

3. **After Test**: Fixture deletes user via `supabase.auth.admin.deleteUser()`
   - Automatic cleanup
   - No leftover test data

#### Approach B: RegisterByAuthPage (Manual)

1. **In Test**: Call `registerPage.adminRegister(user)` when needed
   - Creates user via Admin API
   - Returns user ID for cleanup
   - No session set (you control authentication)

2. **During Test**: Interact with UI as needed
   - Test registration forms
   - Test duplicate detection
   - Test validation errors

3. **In afterEach**: Manual cleanup via `registerPage.adminDeleteUser(userId)`
   - You manage cleanup timing
   - More control over test lifecycle

### Migration Guide

#### Before (Old Approach - Hit Rate Limits):

```typescript
import { test, expect } from "@playwright/test";
import { generateUniqueUser } from "../../fixtures/users";

test("my test", async ({ page }) => {
  const user = generateUniqueUser();

  await page.goto("/auth/register");
  await page.fill("#email", user.email);
  await page.fill("#password", user.password);
  await page.click('button[type="submit"]');
  // ❌ This sends an email → rate limits!
});
```

#### After - Approach A (For Authenticated Flows):

```typescript
import { test, expect } from "../../fixtures/auth.fixture";

test("my test", async ({ authenticatedUser, page }) => {
  // ✅ User already exists and authenticated, no email sent!
  await page.goto("/dashboard");
  // User is ready to use
});
```

#### After - Approach B (For Testing Registration Logic):

```typescript
import { test, expect } from "@playwright/test";
import { RegisterByAuthPage } from "../../page-objects/auth/register-by-auth.page";
import { generateUniqueUser } from "../../fixtures/users";

test("duplicate email test", async ({ page }) => {
  const registerPage = new RegisterByAuthPage(page);
  const user = generateUniqueUser();

  // ✅ Create user via Admin API - no email sent!
  const userId = await registerPage.adminRegister(user);

  // Now test duplicate detection via UI
  await registerPage.navigate();
  await registerPage.register(user);
  await registerPage.expectErrorMessage();

  // Cleanup
  await registerPage.adminDeleteUser(userId);
});
```

### Benefits

| Old Approach (Manual Registration) | Approach A (Fixture)      | Approach B (Page Object)         |
| ---------------------------------- | ------------------------- | -------------------------------- |
| ❌ Sends emails                    | ✅ No emails              | ✅ No emails                     |
| ❌ Rate limits                     | ✅ No rate limits         | ✅ No rate limits                |
| ❌ Slow (email delays)             | ✅ Fast (instant)         | ✅ Fast (instant)                |
| ❌ Manual cleanup                  | ✅ Auto cleanup           | ⚠️ Manual cleanup (in afterEach) |
| ❌ CI failures                     | ✅ Reliable in CI         | ✅ Reliable in CI                |
| ❌ Extra boilerplate               | ✅ Zero boilerplate       | ⚠️ Some boilerplate needed       |
| ✅ Full UI testing                 | ⚠️ User pre-authenticated | ✅ Flexible timing control       |

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

| Use Case                              | Recommended Approach                     | Reason                                                |
| ------------------------------------- | ---------------------------------------- | ----------------------------------------------------- |
| Testing authenticated user flows      | ✅ **Approach A** (`auth.fixture.ts`)    | Automatic authentication, zero boilerplate            |
| Testing dashboard/protected routes    | ✅ **Approach A** (`auth.fixture.ts`)    | User session already set                              |
| Testing user-specific features        | ✅ **Approach A** (`auth.fixture.ts`)    | Clean, simple, automatic cleanup                      |
| Testing duplicate email detection     | ✅ **Approach B** (`RegisterByAuthPage`) | Need to create user first, then test UI               |
| Testing registration validation       | ✅ **Approach B** (`RegisterByAuthPage`) | Need precise control over timing                      |
| Testing login flow                    | ✅ **Approach B** (`RegisterByAuthPage`) | Create user via Admin, then test login UI             |
| Testing complete registration UI flow | ⚠️ **Neither** (Manual registration)     | Test the full user journey including success messages |
| Load testing (many users)             | ✅ **Approach A** (`auth.fixture.ts`)    | Fastest, most efficient                               |

### Complete Test File Examples

#### Example A: Testing Authenticated User Features

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

#### Example B: Testing Registration Logic with Duplicates

```typescript
import { test, expect } from "@playwright/test";
import { RegisterByAuthPage } from "../../page-objects/auth/register-by-auth.page";
import { generateUniqueUser } from "../../fixtures/users";

test.describe("Duplicate Email Registration", () => {
  let registerPage: RegisterByAuthPage;
  const userIdsToCleanup: string[] = [];

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterByAuthPage(page);
  });

  test.afterEach(async () => {
    for (const userId of userIdsToCleanup) {
      await registerPage.adminDeleteUser(userId);
    }
    userIdsToCleanup.length = 0;
  });

  test("should show error when registering with existing email", async ({ page }) => {
    const user = generateUniqueUser();

    // Create user via Admin API
    const userId = await registerPage.adminRegister(user);
    userIdsToCleanup.push(userId);

    // Try to register via UI with same email
    await registerPage.navigate();
    await registerPage.register(user);

    // Assert error is shown
    await registerPage.expectErrorMessage();
    await expect(page).toHaveURL(/\/auth\/register/);
  });

  test("should allow user to correct email after error", async ({ page }) => {
    const existingUser = generateUniqueUser();
    const userId = await registerPage.adminRegister(existingUser);
    userIdsToCleanup.push(userId);

    // Try duplicate
    await registerPage.navigate();
    await registerPage.register(existingUser);
    await registerPage.expectErrorMessage();

    // Correct with new email
    const newUser = generateUniqueUser();
    await registerPage.fillEmail(newUser.email);
    await registerPage.fillPassword(newUser.password);
    await registerPage.fillConfirmPassword(newUser.password);
    await registerPage.submit();

    // Should succeed
    await registerPage.expectSuccessMessage();
  });
});
```
