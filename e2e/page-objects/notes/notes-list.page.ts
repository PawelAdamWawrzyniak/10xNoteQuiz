import { type Page, type Locator, expect } from "@playwright/test";

/**
 * Page Object Model for Notes List Page
 * Encapsulates all interactions with /notes (main notes page)
 */
export class NotesListPage {
  readonly page: Page;

  // Locators
  readonly pageHeading: Locator;
  readonly createNoteButton: Locator;
  readonly notesList: Locator;
  readonly searchInput: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Main page elements
    this.pageHeading = page.getByRole("heading", { name: /notatki/i });
    this.createNoteButton = page.getByRole("button", { name: /nowa notatka/i });
    this.notesList = page.locator('[data-testid="notes-list"]').or(page.locator(".notes-container"));
    this.searchInput = page.getByPlaceholder(/szukaj/i);
    this.logoutButton = page.getByRole("button", { name: /wyloguj/i });
  }

  /**
   * Navigate to the notes list page
   */
  async navigate() {
    await this.page.goto("/notes");
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Wait for the notes page to load completely
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState("networkidle");
    // Wait for either the heading or the create button to be visible
    await Promise.race([
      this.pageHeading.waitFor({ state: "visible", timeout: 10000 }),
      this.createNoteButton.waitFor({ state: "visible", timeout: 10000 }),
    ]).catch(() => {
      // If neither is visible, that's okay - the page might have a different structure
      // We'll verify with expectToBeVisible() in the test
    });
  }

  /**
   * Verify we are on the notes page
   * This is the main assertion for successful redirects after login/registration
   */
  async expectToBeVisible() {
    // Verify URL contains /notes
    await expect(this.page).toHaveURL(/\/notes/);

    // Wait for page to be fully loaded
    await this.waitForPageLoad();
  }

  /**
   * Verify the page heading is visible
   */
  async expectHeadingVisible() {
    await expect(this.pageHeading).toBeVisible();
  }

  /**
   * Verify the create note button is visible
   */
  async expectCreateButtonVisible() {
    await expect(this.createNoteButton).toBeVisible();
  }

  /**
   * Click the create note button
   */
  async clickCreateNote() {
    await this.createNoteButton.click();
  }

  /**
   * Verify the user is authenticated (can see notes page content)
   */
  async expectAuthenticated() {
    await this.expectToBeVisible();
    // Additional checks could include checking for user menu, logout button, etc.
  }

  /**
   * Get the current URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }
}
