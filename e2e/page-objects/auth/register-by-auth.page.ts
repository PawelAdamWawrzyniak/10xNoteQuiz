import { type Page } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";
import { RegisterPage } from "./register.page";
import type { TestUser } from "../../fixtures/users";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables");
}

/**
 * Extended Page Object Model for Registration using Admin API
 * Combines fast Admin API user creation with UI verification methods
 *
 * Use this when you need to:
 * - Quickly create existing users for duplicate email tests
 * - Set up test users without going through the UI flow
 * - Speed up tests that need pre-existing users
 */
export class RegisterByAuthPage extends RegisterPage {
  private supabase;

  constructor(page: Page) {
    super(page);
    this.supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  /**
   * Create a user directly using Supabase Admin API
   * Bypasses UI registration flow and email confirmation
   *
   * @param user - Test user data to create
   * @returns User ID for cleanup purposes
   * @throws Error if user creation fails
   */
  async adminRegister(user: TestUser): Promise<string> {
    const { data, error } = await this.supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
    });

    if (error) {
      throw new Error(`Failed to create test user via Admin API: ${error.message}`);
    }

    if (!data.user) {
      throw new Error("User creation succeeded but no user data returned");
    }

    // Optionally set session in browser if session data is available
    if (data.session) {
      await this.page.goto("/");
      await this.page.evaluate(
        ({ session }) => {
          localStorage.setItem("supabase.auth.token", JSON.stringify(session));
        },
        { session: data.session }
      );
    }

    return data.user.id;
  }

  /**
   * Delete a user using Admin API
   * Use this for cleanup after tests
   *
   * @param userId - The user ID to delete
   */
  async adminDeleteUser(userId: string): Promise<void> {
    try {
      const { error } = await this.supabase.auth.admin.deleteUser(userId);
      if (error) {
        // eslint-disable-next-line no-console
        console.error(`Failed to delete test user ${userId}:`, error);
      }
    } catch (cleanupError) {
      // eslint-disable-next-line no-console
      console.error(`Failed to cleanup test user ${userId}:`, cleanupError);
    }
  }

  /**
   * Create user via Admin API and return both user data and ID
   * Useful when you need to track user for both testing and cleanup
   *
   * @param user - Test user data to create
   * @returns Object containing the user data and user ID
   */
  async adminRegisterWithData(user: TestUser): Promise<{ user: TestUser; userId: string }> {
    const userId = await this.adminRegister(user);
    return { user, userId };
  }
}
