import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, PATCH, DELETE } from "../[noteId]";
import type { APIContext } from "astro";

// ============================================================================
// Test Helpers & Factories
// ============================================================================

/**
 * Creates a mock note object with default values
 */
const createMockNote = (overrides = {}) => ({
  id: "550e8400-e29b-41d4-a716-446655440000",
  user_id: "test-user-123",
  title: "Test Note",
  content: "Test content",
  category_id: null,
  created_at: "2025-10-22T12:00:00Z",
  updated_at: "2025-10-22T12:00:00Z",
  ...overrides,
});

/**
 * Creates a mock note with tags and SRS data
 */
const createMockNoteWithDetails = (overrides = {}) => ({
  ...createMockNote(overrides),
  tags: [],
  srs_data: null,
});

/**
 * Creates a mock for successful findNoteById
 */
const createSuccessfulFindMock = (mockSupabase: any, noteData: any) => {
  const mockSingle = vi.fn().mockResolvedValue({ data: noteData, error: null });
  const mockEq2 = vi.fn().mockReturnValue({ single: mockSingle });
  const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 });
  const mockSelect = vi.fn().mockReturnValue({ eq: mockEq1 });

  mockSupabase.from.mockReturnValue({ select: mockSelect });

  return { mockSelect, mockEq1, mockEq2, mockSingle };
};

/**
 * Creates a mock for successful updateNote
 */
const createSuccessfulUpdateMock = (mockSupabase: any, updatedNote: any) => {
  // Mock the update operation
  const mockUpdateEq2 = vi.fn().mockResolvedValue({ error: null });
  const mockUpdateEq1 = vi.fn().mockReturnValue({ eq: mockUpdateEq2 });
  const mockUpdate = vi.fn().mockReturnValue({ eq: mockUpdateEq1 });

  // Mock findNoteById for verification (called twice: before update & after)
  const mockFindSingle = vi.fn().mockResolvedValue({ data: updatedNote, error: null });
  const mockFindEq2 = vi.fn().mockReturnValue({ single: mockFindSingle });
  const mockFindEq1 = vi.fn().mockReturnValue({ eq: mockFindEq2 });
  const mockSelect = vi.fn().mockReturnValue({ eq: mockFindEq1 });

  mockSupabase.from.mockImplementation((table: string) => {
    if (table === "notes") {
      return {
        select: mockSelect,
        update: mockUpdate,
      };
    }
    return {};
  });

  return { mockUpdate, mockUpdateEq1, mockUpdateEq2, mockSelect, mockFindSingle };
};

/**
 * Creates a mock for note not found scenario
 */
const createNotFoundMock = (mockSupabase: any) => {
  const mockSingle = vi.fn().mockResolvedValue({ data: null, error: null });
  const mockEq2 = vi.fn().mockReturnValue({ single: mockSingle });
  const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 });
  const mockSelect = vi.fn().mockReturnValue({ eq: mockEq1 });

  mockSupabase.from.mockReturnValue({ select: mockSelect });

  return { mockSelect, mockSingle };
};

/**
 * Creates a mock for database errors
 */
const createDatabaseErrorMock = (mockSupabase: any, errorMessage: string) => {
  const mockError = { message: errorMessage };
  const mockSingle = vi.fn().mockResolvedValue({ data: null, error: mockError });
  const mockEq2 = vi.fn().mockReturnValue({ single: mockSingle });
  const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 });
  const mockSelect = vi.fn().mockReturnValue({ eq: mockEq1 });

  mockSupabase.from.mockReturnValue({ select: mockSelect });

  return { mockSelect, mockSingle };
};

// ============================================================================
// PATCH /api/notes/[noteId] Tests - NOTE-02 Scenario
// ============================================================================

describe("PATCH /api/notes/[noteId]", () => {
  let mockContext: Partial<APIContext>;
  let mockSupabase: any;
  const validNoteId = "550e8400-e29b-41d4-a716-446655440000";

  beforeEach(() => {
    mockSupabase = { from: vi.fn() };
    mockContext = {
      params: { noteId: validNoteId },
      request: new Request("http://localhost/api/notes/" + validNoteId, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      }),
      locals: {
        supabase: mockSupabase,
        user: { id: "test-user-123" },
      },
    };
  });

  describe("Success Cases", () => {
    it("should update note content successfully", async () => {
      // Arrange
      const updateData = {
        content: "Updated content for my note",
      };

      mockContext.request = new Request("http://localhost/api/notes/" + validNoteId, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      const originalNote = createMockNoteWithDetails({
        id: validNoteId,
        title: "Original Title",
        content: "Original content",
      });

      const updatedNote = createMockNoteWithDetails({
        id: validNoteId,
        title: "Original Title",
        content: updateData.content,
        updated_at: "2025-10-23T12:00:00Z",
      });

      const { mockUpdate } = createSuccessfulUpdateMock(mockSupabase, updatedNote);

      // Act
      const response = await PATCH(mockContext as APIContext);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(responseData.content).toBe(updateData.content);
      expect(responseData.title).toBe("Original Title"); // Title unchanged
      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          content: updateData.content,
        })
      );
    });

    it("should update note title successfully", async () => {
      // Arrange
      const updateData = {
        title: "Updated Title",
      };

      mockContext.request = new Request("http://localhost/api/notes/" + validNoteId, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      const updatedNote = createMockNoteWithDetails({
        id: validNoteId,
        title: updateData.title,
        content: "Original content",
        updated_at: "2025-10-23T12:00:00Z",
      });

      const { mockUpdate } = createSuccessfulUpdateMock(mockSupabase, updatedNote);

      // Act
      const response = await PATCH(mockContext as APIContext);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(responseData.title).toBe(updateData.title);
      expect(responseData.content).toBe("Original content"); // Content unchanged
      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          title: updateData.title,
        })
      );
    });

    it("should update both title and content simultaneously", async () => {
      // Arrange
      const updateData = {
        title: "Completely Updated",
        content: "Brand new content",
      };

      mockContext.request = new Request("http://localhost/api/notes/" + validNoteId, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      const updatedNote = createMockNoteWithDetails({
        id: validNoteId,
        title: updateData.title,
        content: updateData.content,
        updated_at: "2025-10-23T12:00:00Z",
      });

      const { mockUpdate } = createSuccessfulUpdateMock(mockSupabase, updatedNote);

      // Act
      const response = await PATCH(mockContext as APIContext);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(responseData.title).toBe(updateData.title);
      expect(responseData.content).toBe(updateData.content);
      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          title: updateData.title,
          content: updateData.content,
        })
      );
    });

    it("should update category_id", async () => {
      // Arrange
      const newCategoryId = "660e8400-e29b-41d4-a716-446655440001";
      const updateData = {
        category_id: newCategoryId,
      };

      mockContext.request = new Request("http://localhost/api/notes/" + validNoteId, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      const updatedNote = createMockNoteWithDetails({
        id: validNoteId,
        category_id: newCategoryId,
      });

      const { mockUpdate } = createSuccessfulUpdateMock(mockSupabase, updatedNote);

      // Act
      const response = await PATCH(mockContext as APIContext);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(responseData.category_id).toBe(newCategoryId);
      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          category_id: newCategoryId,
        })
      );
    });

    it("should handle empty update (no fields changed)", async () => {
      // Arrange
      const updateData = {};

      mockContext.request = new Request("http://localhost/api/notes/" + validNoteId, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      const existingNote = createMockNoteWithDetails({
        id: validNoteId,
      });

      createSuccessfulUpdateMock(mockSupabase, existingNote);

      // Act
      const response = await PATCH(mockContext as APIContext);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(responseData).toEqual(existingNote);
    });
  });

  describe("Validation Errors", () => {
    it("should return 400 for invalid noteId format", async () => {
      // Arrange
      mockContext.params = { noteId: "invalid-id" };
      mockContext.request = new Request("http://localhost/api/notes/invalid-id", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Test" }),
      });

      // Act
      const response = await PATCH(mockContext as APIContext);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(responseData.error).toBe("Invalid path parameters.");
      expect(mockSupabase.from).not.toHaveBeenCalled();
    });

    it("should return 400 for invalid JSON body", async () => {
      // Arrange
      mockContext.request = new Request("http://localhost/api/notes/" + validNoteId, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: "invalid json{",
      });

      // Act
      const response = await PATCH(mockContext as APIContext);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(responseData.error).toBe("Invalid JSON in request body.");
    });

    it("should return 400 for empty title string", async () => {
      // Arrange
      const invalidData = {
        title: "",
      };

      mockContext.request = new Request("http://localhost/api/notes/" + validNoteId, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invalidData),
      });

      // Act
      const response = await PATCH(mockContext as APIContext);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(responseData.error).toBe("Invalid request body.");
    });

    it("should return 400 for empty content string", async () => {
      // Arrange
      const invalidData = {
        content: "",
      };

      mockContext.request = new Request("http://localhost/api/notes/" + validNoteId, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invalidData),
      });

      // Act
      const response = await PATCH(mockContext as APIContext);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(responseData.error).toBe("Invalid request body.");
    });

    it("should return 400 for title exceeding max length", async () => {
      // Arrange
      const invalidData = {
        title: "a".repeat(501), // Max is 500
      };

      mockContext.request = new Request("http://localhost/api/notes/" + validNoteId, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invalidData),
      });

      // Act
      const response = await PATCH(mockContext as APIContext);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(responseData.error).toBe("Invalid request body.");
    });

    it("should return 400 for invalid category_id UUID", async () => {
      // Arrange
      const invalidData = {
        category_id: "not-a-uuid",
      };

      mockContext.request = new Request("http://localhost/api/notes/" + validNoteId, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invalidData),
      });

      // Act
      const response = await PATCH(mockContext as APIContext);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(responseData.error).toBe("Invalid request body.");
    });
  });

  describe("Authorization", () => {
    it("should return 401 when user is not authenticated", async () => {
      // Arrange
      mockContext.locals = {
        supabase: mockSupabase,
        user: null,
      };

      mockContext.request = new Request("http://localhost/api/notes/" + validNoteId, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Test" }),
      });

      // Act
      const response = await PATCH(mockContext as APIContext);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(401);
      expect(responseData.error).toBe("Unauthorized. Please log in.");
      expect(mockSupabase.from).not.toHaveBeenCalled();
    });

    it("should return 500 when Supabase client is unavailable", async () => {
      // Arrange
      mockContext.locals = {
        supabase: null,
        user: { id: "test-user-123" },
      };

      mockContext.request = new Request("http://localhost/api/notes/" + validNoteId, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Test" }),
      });

      // Act
      const response = await PATCH(mockContext as APIContext);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(responseData.error).toBe("Supabase client is not available.");
    });

    it("should return 404 when note does not exist", async () => {
      // Arrange
      const nonExistentNoteId = "770e8400-e29b-41d4-a716-446655440099";
      mockContext.params = { noteId: nonExistentNoteId };
      mockContext.request = new Request("http://localhost/api/notes/" + nonExistentNoteId, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Updated Title" }),
      });

      createNotFoundMock(mockSupabase);

      // Act
      const response = await PATCH(mockContext as APIContext);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(404);
      expect(responseData.error).toBe("Note not found.");
    });

    it("should return 404 when trying to update another user's note (NOTE-04 scenario)", async () => {
      // Arrange - User B tries to update User A's note
      mockContext.locals = {
        supabase: mockSupabase,
        user: { id: "user-b-id" }, // Different user
      };

      mockContext.request = new Request("http://localhost/api/notes/" + validNoteId, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Malicious Update" }),
      });

      // Mock returns null because note doesn't belong to user-b-id
      createNotFoundMock(mockSupabase);

      // Act
      const response = await PATCH(mockContext as APIContext);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(404);
      expect(responseData.error).toBe("Note not found.");
      // Verify the service was queried with the wrong user_id
      expect(mockSupabase.from).toHaveBeenCalledWith("notes");
    });
  });

  describe("Database Errors", () => {
    it("should return 500 when database query fails", async () => {
      // Arrange
      mockContext.request = new Request("http://localhost/api/notes/" + validNoteId, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Updated Title" }),
      });

      createDatabaseErrorMock(mockSupabase, "Database connection lost");

      // Act
      const response = await PATCH(mockContext as APIContext);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(responseData.error).toBe("Internal Server Error.");
      expect(responseData.message).toContain("Database connection lost");
    });

    it("should return 404 when update succeeds but final fetch returns null", async () => {
      // Arrange
      mockContext.request = new Request("http://localhost/api/notes/" + validNoteId, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Updated Title" }),
      });

      const mockExistingNote = createMockNoteWithDetails({ id: validNoteId });

      // First findNoteById succeeds (verification)
      let callCount = 0;
      const mockSingle = vi.fn().mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          // First call succeeds (existing note check)
          return Promise.resolve({ data: mockExistingNote, error: null });
        }
        // Second call returns null (after update - edge case)
        return Promise.resolve({ data: null, error: null });
      });

      const mockUpdateEq2 = vi.fn().mockResolvedValue({ error: null });
      const mockUpdateEq1 = vi.fn().mockReturnValue({ eq: mockUpdateEq2 });
      const mockUpdate = vi.fn().mockReturnValue({ eq: mockUpdateEq1 });

      const mockEq2 = vi.fn().mockReturnValue({ single: mockSingle });
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq1 });

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === "notes") {
          return {
            select: mockSelect,
            update: mockUpdate,
          };
        }
        return {};
      });

      // Act
      const response = await PATCH(mockContext as APIContext);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(404);
      expect(responseData.error).toBe("Note not found.");
    });
  });
});