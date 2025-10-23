# E2E Test Implementation Plan: AUTH-01 - User Registration

**Test Plan Reference**: `test-plan.md` - Scenario AUTH-01
**Type**: End-to-End Test (E2E) with Playwright
**Priority**: Critical
**Status**: ⏳ Awaiting Approval

## Test Scenario Summary

### AUTH-01: User Registration
**Scenario**: User fills in the registration form with valid data and clicks "Register"
**Expected Result**:
- Account is created successfully
- User is logged in automatically
- User is redirected to the main page (notes page)

## Current State Analysis

### ✅ What We Have
- Playwright installed (`@playwright/test": "^1.56.1"`)
- Registration page: `/auth/register`
- Registration form component: `RegisterForm.tsx`
- API endpoint: `/api/auth/register`
- Form fields:
  - Email (type: email, id: "email")
  - Password (type: password, id: "password")
  - Confirm Password (type: password, id: "confirmPassword")
  - Submit button

### ❌ What We Need to Create
- Playwright configuration (`playwright.config.ts`)
- E2E test directory structure
- Page Object Models
- Test fixtures for user data
- E2E test file for AUTH-01 scenario
- Helper utilities for authentication

## Implementation Plan

### Phase 1: Project Setup (30 min)

#### 1.1 Create Playwright Configuration
**File**: `playwright.config.ts`

**Configuration Requirements** (from `.ai/playwright-e2e-testing.mdc`):
- ✅ Initialize with **Chromium/Desktop Chrome only**
- ✅ Set base URL for local dev environment
- ✅ Configure test directory: `./e2e`
- ✅ Enable trace on first retry
- ✅ Configure screenshots on failure
- ✅ Set up test timeout: 30s
- ✅ Use projects for different environments (dev, staging)

**Key Settings**:
```typescript
{
  baseURL: 'http://localhost:4321', // Astro default dev server
  testDir: './e2e',
  timeout: 30000,
  retries: 1,
  use: {
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
}
```

#### 1.2 Create Directory Structure
```
e2e/
├── page-objects/           # Page Object Models
│   ├── auth/
│   │   ├── register.page.ts
│   │   └── login.page.ts
│   └── notes/
│       └── notes-list.page.ts
├── fixtures/               # Test data
│   └── users.ts
├── helpers/                # Utility functions
│   ├── auth.helpers.ts
│   └── database.helpers.ts
└── tests/                  # Actual tests
    └── auth/
        ├── auth-01-registration.spec.ts
        ├── auth-02-duplicate-email.spec.ts
        └── auth-03-login.spec.ts
```

### Phase 2: Page Object Model (45 min)

#### 2.1 Create RegisterPage POM
**File**: `e2e/page-objects/auth/register.page.ts`

**Purpose**: Encapsulate registration page interactions

**Key Methods**:
```typescript
class RegisterPage {
  // Locators
  emailInput: Locator         // getByLabel('Adres e-mail')
  passwordInput: Locator      // getByLabel('Hasło')
  confirmPasswordInput: Locator // getByLabel('Potwierdź hasło')
  submitButton: Locator       // getByRole('button', { name: /zarejestruj/i })
  successMessage: Locator     // getByText(/rejestracja pomyślna/i)
  errorMessage: Locator       // getByRole('alert')

  // Actions
  async navigate()            // Go to /auth/register
  async fillEmail(email)      // Fill email field
  async fillPassword(pwd)     // Fill password field
  async fillConfirmPassword(pwd) // Fill confirm password field
  async submit()              // Click submit button
  async register(email, password) // Complete flow

  // Assertions
  async expectSuccessMessage() // Verify success alert
  async expectErrorMessage(msg) // Verify error alert
}
```

**Rationale**:
- Uses `getByLabel` for form fields (accessible, resilient)
- No `data-testid` needed initially (forms already have semantic labels)
- If selectors are fragile, we'll add `data-testid` later

#### 2.2 Create NotesListPage POM
**File**: `e2e/page-objects/notes/notes-list.page.ts`

**Purpose**: Verify successful redirect after registration

**Key Methods**:
```typescript
class NotesListPage {
  // Locators
  pageTitle: Locator          // getByRole('heading', { name: /notatki/i })
  createNoteButton: Locator   // getByRole('button', { name: /nowa notatka/i })

  // Assertions
  async expectToBeVisible()   // Verify on notes page
  async waitForPageLoad()     // Wait for page to load
}
```

### Phase 3: Test Fixtures (15 min)

#### 3.1 Create User Fixtures
**File**: `e2e/fixtures/users.ts`

**Purpose**: Generate test user data

```typescript
export const testUsers = {
  valid: {
    email: `test-${Date.now()}@example.com`, // Unique email
    password: 'TestPassword123!',
  },
  invalidEmail: {
    email: 'invalid-email',
    password: 'TestPassword123!',
  },
  weakPassword: {
    email: 'test@example.com',
    password: '123',
  },
  mismatchedPassword: {
    email: 'test@example.com',
    password: 'TestPassword123!',
    confirmPassword: 'DifferentPassword456!',
  },
};

// Helper to generate unique user
export const generateUniqueUser = () => ({
  email: `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}@example.com`,
  password: 'TestPassword123!',
});
```

### Phase 4: E2E Test Implementation (60 min)

#### 4.1 AUTH-01 Main Test
**File**: `e2e/tests/auth/auth-01-registration.spec.ts`

**Test Structure** (AAA Pattern):
```typescript
import { test, expect } from '@playwright/test';
import { RegisterPage } from '../../page-objects/auth/register.page';
import { NotesListPage } from '../../page-objects/notes/notes-list.page';
import { generateUniqueUser } from '../../fixtures/users';

test.describe('AUTH-01: User Registration', () => {
  let registerPage: RegisterPage;
  let notesPage: NotesListPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    notesPage = new NotesListPage(page);
    await registerPage.navigate();
  });

  test('should register user with valid data and redirect to notes page', async ({ page }) => {
    // Arrange
    const user = generateUniqueUser();

    // Act
    await registerPage.fillEmail(user.email);
    await registerPage.fillPassword(user.password);
    await registerPage.fillConfirmPassword(user.password);
    await registerPage.submit();

    // Assert - Success message appears
    await registerPage.expectSuccessMessage();

    // Assert - Can navigate to login (or redirect happens)
    // Note: Current implementation shows success card, not auto-login
    await expect(page).toHaveURL(/\/auth\/register/); // Still on register page

    // Click "Go to login" link
    await page.getByRole('link', { name: /przejdź do logowania/i }).click();

    // Verify redirected to login page
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});
```

**IMPORTANT DISCOVERY**:
Current implementation shows **success message** but does **NOT auto-login** or redirect!

This deviates from AUTH-01 expected behavior:
> "Użytkownik zostaje zalogowany i przekierowany na stronę główną"

**Two Options**:
1. **Test current behavior** (success message → manual login)
2. **Update code to match spec** (auto-login → redirect to /notes)

**Recommended**: We should discuss this with you!

#### 4.2 Additional Test Scenarios

**Validation Tests**:
```typescript
test('should show error for invalid email format', async () => {
  // Test client-side validation
});

test('should show error for weak password', async () => {
  // Test password requirements
});

test('should show error when passwords do not match', async () => {
  // Test confirmPassword validation
});

test('should show error for empty fields', async () => {
  // Test required field validation
});
```

**API Error Tests**:
```typescript
test('should show error when email already exists (AUTH-02)', async () => {
  // Create user first, then try to register again
});

test('should show error when server is unreachable', async () => {
  // Mock network failure
});
```

### Phase 5: Helper Utilities (30 min)

#### 5.1 Authentication Helpers
**File**: `e2e/helpers/auth.helpers.ts`

**Purpose**: Reusable auth flows for test setup

```typescript
export async function registerUser(page: Page, user: UserData) {
  const registerPage = new RegisterPage(page);
  await registerPage.navigate();
  await registerPage.register(user.email, user.password);
}

export async function loginUser(page: Page, credentials: Credentials) {
  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.login(credentials.email, credentials.password);
}

// For tests that need authenticated state
export async function setupAuthenticatedUser(page: Page) {
  const user = generateUniqueUser();
  await registerUser(page, user);
  // If auto-login not implemented, manually login
  await loginUser(page, user);
  return user;
}
```

#### 5.2 Database Cleanup Helpers (Optional)
**File**: `e2e/helpers/database.helpers.ts`

**Purpose**: Clean up test data after tests

```typescript
// Only if we need to clean up test users from Supabase
export async function cleanupTestUser(email: string) {
  // Use Supabase admin client to delete test user
  // Only in non-production environments
}
```

### Phase 6: CI/CD Integration (15 min)

#### 6.1 Add npm Scripts
**File**: `package.json`

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:headed": "playwright test --headed",
    "test:e2e:debug": "playwright test --debug",
    "test:e2e:report": "playwright show-report"
  }
}
```

#### 6.2 GitHub Actions Workflow (Future)
**File**: `.github/workflows/e2e-tests.yml`

```yaml
name: E2E Tests
on: [pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install chromium
      - run: npm run build
      - run: npm run preview & # Start preview server
      - run: npm run test:e2e
```

## Test Data Strategy

### User Data Management
- **Generate unique emails** using timestamp + random string
- **Avoid conflicts** between parallel test runs
- **Use consistent passwords** for test users
- **Clean up test data** after test suite (optional, depends on Supabase setup)

### Environment Variables
```env
# .env.test
PUBLIC_BASE_URL=http://localhost:4321
SUPABASE_URL=your-test-supabase-url
SUPABASE_KEY=your-test-supabase-key
```

## Expected Test Coverage

### AUTH-01 Specific Tests
1. ✅ **Happy path**: Valid registration → Success message → Can login
2. ✅ **Email validation**: Invalid email format
3. ✅ **Password validation**: Weak password
4. ✅ **Password match**: Mismatched passwords
5. ✅ **Required fields**: Empty fields validation
6. ✅ **Duplicate email** (AUTH-02): Already registered email
7. ✅ **Network error**: Server unreachable

### Total Estimated Tests
- **Main scenario**: 1 test
- **Validation scenarios**: 4 tests
- **Error scenarios**: 2 tests
- **Total**: ~7 tests for registration flow

## Implementation Timeline

| Phase | Task | Duration | Total |
|-------|------|----------|-------|
| 1 | Playwright setup & config | 30 min | 30 min |
| 2 | Page Object Models | 45 min | 1h 15min |
| 3 | Test fixtures | 15 min | 1h 30min |
| 4 | E2E test implementation | 60 min | 2h 30min |
| 5 | Helper utilities | 30 min | 3h |
| 6 | CI/CD integration | 15 min | 3h 15min |
| **Total** | | **~3-4 hours** | |

## Key Decisions Needed

### 🔴 CRITICAL: Auto-Login Behavior
**Current**: Registration shows success message, user must manually click "Go to login"
**Expected (per test plan)**: User is auto-logged in and redirected to notes page

**Options**:
1. **Option A**: Test current behavior (simpler, no code changes)
   - Test registration → success message → manual navigation to login
   - Does NOT match AUTH-01 spec

2. **Option B**: Update code to match spec (recommended)
   - Modify `RegisterForm.tsx` to auto-login after registration
   - Add redirect to `/notes` after successful login
   - Matches AUTH-01 spec exactly

**Recommendation**: **Option B** - Update code to auto-login, then test

### Test Selectors Strategy
**Current approach**: Use semantic selectors (labels, roles, text)
**Fallback**: Add `data-testid` if selectors are fragile

**When to add data-testid**:
- Dynamic text content
- Elements without clear semantic role
- Elements that frequently change structure

## Success Criteria

### Test Passes When:
- ✅ User can navigate to `/auth/register`
- ✅ User can fill in valid registration data
- ✅ Form submits successfully
- ✅ Success message is displayed
- ✅ User is redirected to notes page (or can navigate to login)
- ✅ Test runs in <30 seconds
- ✅ Test is reliable (no flakiness)

### Test Quality Metrics:
- **Readability**: Tests use descriptive names and follow AAA pattern
- **Maintainability**: Page Object Model separates selectors from tests
- **Reliability**: Uses Playwright auto-waiting and proper assertions
- **Speed**: Completes in reasonable time (<30s per test)

## Risks & Mitigations

### Risk 1: Flaky Tests
**Cause**: Race conditions, timing issues
**Mitigation**:
- Use Playwright's auto-waiting
- Use `waitForLoadState()` when needed
- Avoid hard-coded `sleep()`

### Risk 2: Test Data Conflicts
**Cause**: Multiple tests using same email
**Mitigation**:
- Generate unique emails with timestamp
- Use test isolation with `test.beforeEach()`
- Clean up test data after tests

### Risk 3: Environment Differences
**Cause**: Dev vs CI environment differences
**Mitigation**:
- Use environment variables
- Test on both local and CI
- Document environment setup

## Next Steps (After Approval)

1. ✅ **Approve this plan**
2. Create Playwright configuration
3. Set up directory structure
4. Implement Page Object Models
5. Create test fixtures
6. Write AUTH-01 E2E test
7. Run and verify test passes
8. Document results in `AUTH-01-e2e-test-results.md`

## Questions for You

1. **Auto-login behavior**: Should we update code to auto-login (Option B) or test current behavior (Option A)?
2. **Test environment**: Should we use local dev server (`npm run dev`) or build + preview (`npm run build && npm run preview`)?
3. **Test data cleanup**: Do you want automatic cleanup of test users from Supabase?
4. **Visual regression**: Should we add screenshot comparison tests?
5. **Parallel execution**: Do you want tests to run in parallel (faster but needs careful data isolation)?

## References

- **Test Plan**: `test-plan.md` (AUTH-01 scenario)
- **Playwright Guidelines**: `.ai/playwright-e2e-testing.mdc`
- **Registration Page**: `src/pages/auth/register.astro`
- **Registration Form**: `src/components/RegisterForm.tsx`
- **API Endpoint**: `src/pages/api/auth/register.ts`