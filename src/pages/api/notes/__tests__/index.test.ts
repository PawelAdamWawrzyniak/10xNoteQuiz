import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST, GET } from "../index";
import type { APIContext } from "astro";

// ============================================================================
// Test Helpers & Factories
// ============================================================================

/**
 * Creates a mock note object with default values
 */
const createMockNote = (overrides = {}) => ({
  id: "note-123",
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
 * Creates a simplified Supabase mock for successful note creation
 */
const createSuccessfulNoteMock = (mockSupabase: any, noteData: any, noteWithDetails: any) => {
  const mockSingle = vi.fn().mockResolvedValue({ data: noteData, error: null });
  const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
  const mockInsert = vi.fn().mockReturnValue({ select: mockSelect });

  // Mock findNoteById query
  const mockFindSingle = vi.fn().mockResolvedValue({ data: noteWithDetails, error: null });
  const mockFindEq2 = vi.fn().mockReturnValue({ single: mockFindSingle });
  const mockFindEq1 = vi.fn().mockReturnValue({ eq: mockFindEq2 });
  const mockFindSelect = vi.fn().mockReturnValue({ eq: mockFindEq1 });

  mockSupabase.from.mockImplementation((table: string) => {
    if (table === "notes") {
      return {
        insert: mockInsert,
        select: mockFindSelect,
      };
    }
    return {};
  });

  return { mockInsert, mockSelect, mockSingle };
};

/**
 * Creates a mock for database error scenarios
 */
const createErrorNoteMock = (mockSupabase: any, errorMessage: string) => {
  const mockError = { message: errorMessage };
  const mockSingle = vi.fn().mockResolvedValue({ data: null, error: mockError });
  const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
  const mockInsert = vi.fn().mockReturnValue({ select: mockSelect });

  mockSupabase.from.mockReturnValue({ insert: mockInsert });

  return { mockInsert, mockSelect, mockSingle };
};

/**
 * Creates a mock for successful GET requests
 */
const createSuccessfulGetMock = (mockSupabase: any, notes: any[], totalCount: number) => {
  const mockRange = vi.fn().mockResolvedValue({
    data: notes,
    error: null,
    count: totalCount,
  });
  const mockOrder = vi.fn().mockReturnValue({ range: mockRange });
  const mockEq = vi.fn().mockReturnValue({ order: mockOrder });
  const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });

  mockSupabase.from.mockReturnValue({ select: mockSelect });

  return { mockSelect, mockEq, mockOrder, mockRange };
};

// ============================================================================
// POST /api/notes Tests
// ============================================================================

describe("POST /api/notes", () => {
  let mockContext: Partial<APIContext>;
  let mockSupabase: any;

  beforeEach(() => {
    mockSupabase = { from: vi.fn() };
    mockContext = {
      request: new Request("http://localhost/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }),
      locals: {
        supabase: mockSupabase,
        user: { id: "test-user-123" },
      },
    };
  });

  describe("Success Cases", () => {
    it("should create a note with valid data", async () => {
      const noteData = {
        title: "My New Note",
        content: "This is the content of my note",
        category_id: null,
        tag_ids: [],
      };

      mockContext.request = new Request("http://localhost/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(noteData),
      });

      const mockCreatedNote = createMockNote({
        title: noteData.title,
        content: noteData.content,
      });

      const mockNoteWithTags = createMockNoteWithDetails({
        title: noteData.title,
        content: noteData.content,
      });

      const { mockInsert } = createSuccessfulNoteMock(mockSupabase, mockCreatedNote, mockNoteWithTags);

      const response = await POST(mockContext as APIContext);
      const responseData = await response.json();

      expect(response.status).toBe(201);
      expect(responseData).toEqual(mockNoteWithTags);
      expect(responseData.title).toBe(noteData.title);
      expect(responseData.content).toBe(noteData.content);
      expect(responseData.user_id).toBe("test-user-123");
      expect(mockSupabase.from).toHaveBeenCalledWith("notes");
      expect(mockInsert).toHaveBeenCalledWith({
        user_id: "test-user-123",
        title: noteData.title,
        content: noteData.content,
        category_id: null,
      });
    });

    it("should create a note with category", async () => {
      const validCategoryId = "550e8400-e29b-41d4-a716-446655440000";
      const noteData = {
        title: "Note with Category",
        content: "Content",
        category_id: validCategoryId,
        tag_ids: [],
      };

      mockContext.request = new Request("http://localhost/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(noteData),
      });

      const mockCreatedNote = createMockNote({
        title: noteData.title,
        content: noteData.content,
        category_id: noteData.category_id,
      });

      const mockNoteWithTags = createMockNoteWithDetails({
        title: noteData.title,
        content: noteData.content,
        category_id: noteData.category_id,
      });

      const { mockInsert } = createSuccessfulNoteMock(mockSupabase, mockCreatedNote, mockNoteWithTags);

      const response = await POST(mockContext as APIContext);
      const responseData = await response.json();

      expect(response.status).toBe(201);
      expect(responseData.category_id).toBe(validCategoryId);
      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          category_id: validCategoryId,
        })
      );
    });
  });

  describe("Validation Errors", () => {
    it("should return 400 when title is missing", async () => {
      const invalidData = { content: "Content without title" };

      mockContext.request = new Request("http://localhost/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invalidData),
      });

      const response = await POST(mockContext as APIContext);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.error).toBe("Invalid request body.");
      expect(responseData.details).toBeDefined();
    });

    it("should return 400 when content is missing", async () => {
      const invalidData = { title: "Title without content" };

      mockContext.request = new Request("http://localhost/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invalidData),
      });

      const response = await POST(mockContext as APIContext);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.error).toBe("Invalid request body.");
    });

    it("should return 400 when title is empty string", async () => {
      const invalidData = {
        title: "",
        content: "Content",
      };

      mockContext.request = new Request("http://localhost/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invalidData),
      });

      const response = await POST(mockContext as APIContext);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.error).toBe("Invalid request body.");
    });

    it("should return 400 when content is empty string", async () => {
      const invalidData = {
        title: "Title",
        content: "",
      };

      mockContext.request = new Request("http://localhost/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invalidData),
      });

      const response = await POST(mockContext as APIContext);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.error).toBe("Invalid request body.");
    });

    it("should return 400 when request body is invalid JSON", async () => {
      mockContext.request = new Request("http://localhost/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "invalid json{",
      });

      const response = await POST(mockContext as APIContext);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.error).toBe("Invalid JSON in request body.");
    });
  });

  describe("Authorization", () => {
    it("should return 401 when user is not authenticated", async () => {
      mockContext.locals = {
        supabase: mockSupabase,
        user: null,
      };

      mockContext.request = new Request("http://localhost/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Test", content: "Content" }),
      });

      const response = await POST(mockContext as APIContext);
      const responseData = await response.json();

      expect(response.status).toBe(401);
      expect(responseData.error).toBe("Unauthorized. Please log in.");
      expect(mockSupabase.from).not.toHaveBeenCalled();
    });

    it("should return 500 when Supabase client is unavailable", async () => {
      mockContext.locals = {
        supabase: null,
        user: { id: "test-user-123" },
      };

      mockContext.request = new Request("http://localhost/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Test", content: "Content" }),
      });

      const response = await POST(mockContext as APIContext);
      const responseData = await response.json();

      expect(response.status).toBe(500);
      expect(responseData.error).toBe("Supabase client is not available.");
    });
  });

  describe("Database Errors", () => {
    it("should return 500 when database operation fails", async () => {
      const noteData = {
        title: "Test Note",
        content: "Content",
        category_id: null,
        tag_ids: [],
      };

      mockContext.request = new Request("http://localhost/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(noteData),
      });

      createErrorNoteMock(mockSupabase, "Database connection error");

      const response = await POST(mockContext as APIContext);
      const responseData = await response.json();

      expect(response.status).toBe(500);
      expect(responseData.error).toBe("Internal Server Error.");
      expect(responseData.message).toContain("Database connection error");
    });

    it("should return 500 when note creation succeeds but fetch fails", async () => {
      const noteData = {
        title: "Test Note",
        content: "Content",
        category_id: null,
        tag_ids: [],
      };

      mockContext.request = new Request("http://localhost/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(noteData),
      });

      const mockCreatedNote = createMockNote();

      // Note creation succeeds
      const mockInsertSingle = vi.fn().mockResolvedValue({
        data: mockCreatedNote,
        error: null,
      });
      const mockInsertSelect = vi.fn().mockReturnValue({ single: mockInsertSingle });
      const mockInsert = vi.fn().mockReturnValue({ select: mockInsertSelect });

      // But findNoteById fails
      const mockFindSingle = vi.fn().mockResolvedValue({ data: null, error: null });
      const mockFindEq2 = vi.fn().mockReturnValue({ single: mockFindSingle });
      const mockFindEq1 = vi.fn().mockReturnValue({ eq: mockFindEq2 });
      const mockFindSelect = vi.fn().mockReturnValue({ eq: mockFindEq1 });

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === "notes") {
          return {
            insert: mockInsert,
            select: mockFindSelect,
          };
        }
        return {};
      });

      const response = await POST(mockContext as APIContext);
      const responseData = await response.json();

      expect(response.status).toBe(500);
      expect(responseData.error).toBe("Internal Server Error.");
      expect(responseData.message).toContain("Error retrieving created note");
    });
  });
});

// ============================================================================
// GET /api/notes Tests
// ============================================================================

describe("GET /api/notes", () => {
  let mockContext: Partial<APIContext>;
  let mockSupabase: any;

  beforeEach(() => {
    mockSupabase = { from: vi.fn() };
    mockContext = {
      url: new URL("http://localhost/api/notes?page=1&page_size=20&sort_by=updated_at&order=desc"),
      locals: {
        supabase: mockSupabase,
        user: { id: "test-user-123" },
      },
    };
  });

  describe("Success Cases", () => {
    it("should return notes sorted by updated_at desc with newest first", async () => {
      const mockNotes = [
        createMockNote({
          id: "note-new",
          title: "Newly Created Note",
          updated_at: "2025-10-22T12:00:00Z",
        }),
        createMockNote({
          id: "note-old",
          title: "Older Note",
          updated_at: "2025-10-22T10:00:00Z",
        }),
      ];

      const { mockOrder } = createSuccessfulGetMock(mockSupabase, mockNotes, 2);

      const response = await GET(mockContext as APIContext);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.data).toEqual(mockNotes);
      expect(responseData.data).toHaveLength(2);
      expect(responseData.data[0].id).toBe("note-new");
      expect(responseData.data[0].title).toBe("Newly Created Note");
      expect(responseData.pagination).toEqual({
        current_page: 1,
        total_pages: 1,
        total_items: 2,
      });
      expect(mockOrder).toHaveBeenCalledWith("updated_at", { ascending: false });
    });

    it("should handle pagination correctly", async () => {
      mockContext.url = new URL("http://localhost/api/notes?page=2&page_size=10");

      const mockNotes = [
        createMockNote({
          id: "note-11",
          title: "Note 11",
        }),
      ];

      const { mockRange } = createSuccessfulGetMock(mockSupabase, mockNotes, 21);

      const response = await GET(mockContext as APIContext);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(mockRange).toHaveBeenCalledWith(10, 19);
      expect(responseData.pagination).toEqual({
        current_page: 2,
        total_pages: 3,
        total_items: 21,
      });
    });

    it("should return empty array when no notes exist", async () => {
      createSuccessfulGetMock(mockSupabase, [], 0);

      const response = await GET(mockContext as APIContext);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.data).toEqual([]);
      expect(responseData.pagination.total_items).toBe(0);
      expect(responseData.pagination.total_pages).toBe(0);
    });
  });

  describe("Authorization", () => {
    it("should return 401 when user is not authenticated", async () => {
      mockContext.locals = {
        supabase: mockSupabase,
        user: null,
      };

      const response = await GET(mockContext as APIContext);
      const responseData = await response.json();

      expect(response.status).toBe(401);
      expect(responseData.error).toBe("Unauthorized. Please log in.");
      expect(mockSupabase.from).not.toHaveBeenCalled();
    });

    it("should return 500 when Supabase client is unavailable", async () => {
      mockContext.locals = {
        supabase: null,
        user: { id: "test-user-123" },
      };

      const response = await GET(mockContext as APIContext);
      const responseData = await response.json();

      expect(response.status).toBe(500);
      expect(responseData.error).toBe("Supabase client is not available.");
    });
  });

  describe("Query Parameter Validation", () => {
    it("should use default values for missing query parameters", async () => {
      mockContext.url = new URL("http://localhost/api/notes");

      const mockNotes = [createMockNote()];
      const { mockOrder, mockRange } = createSuccessfulGetMock(mockSupabase, mockNotes, 1);

      const response = await GET(mockContext as APIContext);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.pagination.current_page).toBe(1);
      expect(mockOrder).toHaveBeenCalledWith("updated_at", { ascending: false });
      expect(mockRange).toHaveBeenCalledWith(0, 19); // Default page_size is 20
    });

    it("should use default value (1) for invalid page parameter", async () => {
      mockContext.url = new URL("http://localhost/api/notes?page=-1");

      const mockNotes = [createMockNote()];
      const { mockRange } = createSuccessfulGetMock(mockSupabase, mockNotes, 1);

      const response = await GET(mockContext as APIContext);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      // Invalid page falls back to default (1), which starts at offset 0
      expect(mockRange).toHaveBeenCalledWith(0, 19);
      expect(responseData.pagination.current_page).toBe(1);
    });

    it("should use default value (20) for invalid page_size parameter", async () => {
      mockContext.url = new URL("http://localhost/api/notes?page_size=101");

      const mockNotes = [createMockNote()];
      const { mockRange } = createSuccessfulGetMock(mockSupabase, mockNotes, 1);

      const response = await GET(mockContext as APIContext);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      // Invalid page_size falls back to default (20)
      expect(mockRange).toHaveBeenCalledWith(0, 19);
    });

    it("should accept any string for sort_by parameter", async () => {
      mockContext.url = new URL("http://localhost/api/notes?sort_by=invalid_field");

      const mockNotes = [createMockNote()];
      const { mockOrder } = createSuccessfulGetMock(mockSupabase, mockNotes, 1);

      const response = await GET(mockContext as APIContext);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      // Schema uses .catch() for sort_by, but doesn't validate enum, so it passes through
      expect(mockOrder).toHaveBeenCalledWith("invalid_field", { ascending: false });
    });

    it("should return 400 for invalid UUID in category_id", async () => {
      mockContext.url = new URL("http://localhost/api/notes?category_id=not-a-uuid");

      const response = await GET(mockContext as APIContext);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.error).toBe("Invalid query parameters.");
      expect(mockSupabase.from).not.toHaveBeenCalled();
    });

    it("should return 400 for invalid UUID in tag_id", async () => {
      mockContext.url = new URL("http://localhost/api/notes?tag_id=not-a-uuid");

      const response = await GET(mockContext as APIContext);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.error).toBe("Invalid query parameters.");
      expect(mockSupabase.from).not.toHaveBeenCalled();
    });
  });

  describe("Database Errors", () => {
    it("should return 500 when database query fails", async () => {
      const mockError = { message: "Database query failed" };
      const mockRange = vi.fn().mockResolvedValue({
        data: null,
        error: mockError,
        count: null,
      });
      const mockOrder = vi.fn().mockReturnValue({ range: mockRange });
      const mockEq = vi.fn().mockReturnValue({ order: mockOrder });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });

      mockSupabase.from.mockReturnValue({ select: mockSelect });

      const response = await GET(mockContext as APIContext);
      const responseData = await response.json();

      expect(response.status).toBe(500);
      expect(responseData.error).toBe("Internal Server Error.");
      expect(responseData.message).toContain("Database query failed");
    });
  });
});
