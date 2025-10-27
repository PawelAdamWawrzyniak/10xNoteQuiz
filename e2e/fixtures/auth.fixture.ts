/* eslint-disable react-hooks/rules-of-hooks */
import { test as base } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables");
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export interface AuthenticatedUser {
  id: string;
  email: string;
  password: string;
}

export const test = base.extend<{ authenticatedUser: AuthenticatedUser }>({
  authenticatedUser: async ({ page }, use) => {
    const timestamp = Date.now();
    const email = `test-${timestamp}@mailinator.com`;
    const password = "TestPassword123!";

    // Create user directly using Admin API (no email sent, no rate limits)
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error) {
      throw new Error(`Failed to create test user: ${error.message}`);
    }

    if (!data.user) {
      throw new Error("User creation succeeded but no user data returned");
    }

    const user: AuthenticatedUser = {
      id: data.user.id,
      email,
      password,
    };

    // Set session in browser if session data is available
    if (data.session) {
      await page.goto("/");
      await page.evaluate(
        ({ session }) => {
          localStorage.setItem("supabase.auth.token", JSON.stringify(session));
        },
        { session: data.session }
      );
    }

    // Provide user data to test
    await use(user);

    // Cleanup - delete user after test
    try {
      await supabase.auth.admin.deleteUser(user.id);
    } catch (cleanupError) {
      // eslint-disable-next-line no-console
      console.error(`Failed to cleanup test user ${user.id}:`, cleanupError);
    }
  },
});

export { expect } from "@playwright/test";
