import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST, GET } from "../index";
import type { APIContext } from "astro";

describe("POST /api/notes", () => {
  let mockContext: Partial<APIContext>;
  let mockSupabase: any;

  beforeEach(() => {
    // Arrange: Create fresh mocks for each test
    mockSupabase = {
      from: vi.fn(),
    };

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

  it("should create a new note with valid data", async () => {
    // Arrange
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

    const mockCreatedNote = {
      id: "note-123",
      user_id: "test-user-123",
      title: noteData.title,
      content: noteData.content,
      category_id: null,
      created_at: "2025-10-22T12:00:00Z",
      updated_at: "2025-10-22T12:00:00Z",
    };

    const mockNoteWithTags = {
      ...mockCreatedNote,
      tags: [],
      srs_data: null,
    };

    // Mock the insert chain
    const mockSelect = vi.fn().mockReturnValue({
      single: vi.fn().mockResolvedValue({
        data: mockCreatedNote,
        error: null,
      }),
    });

    const mockInsert = vi.fn().mockReturnValue({
      select: mockSelect,
    });

    // Mock the findNoteById query
    const mockSingleQuery = vi.fn().mockResolvedValue({
      data: mockNoteWithTags,
      error: null,
    });

    const mockEqChain = vi.fn().mockReturnValue({
      single: mockSingleQuery,
    });

    const mockEqUserId = vi.fn().mockReturnValue({
      eq: mockEqChain,
    });

    const mockSelectQuery = vi.fn().mockReturnValue({
      eq: mockEqUserId,
    });

    mockSupabase.from.mockImplementation((table: string) => {
      if (table === "notes") {
        return {
          insert: mockInsert,
          select: mockSelectQuery,
        };
      }
      return {};
    });

    // Act
    const response = await POST(mockContext as APIContext);
    const responseData = await response.json();

    // Assert
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

  it("should return 401 when user is not authenticated", async () => {
    // Arrange
    mockContext.locals = {
      supabase: mockSupabase,
      user: null,
    };

    mockContext.request = new Request("http://localhost/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Test", content: "Content" }),
    });

    // Act
    const response = await POST(mockContext as APIContext);
    const responseData = await response.json();

    // Assert
    expect(response.status).toBe(401);
    expect(responseData.error).toBe("Unauthorized. Please log in.");
  });

  it("should return 400 when title is missing", async () => {
    // Arrange
    const invalidData = {
      content: "Content without title",
    };

    mockContext.request = new Request("http://localhost/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(invalidData),
    });

    // Act
    const response = await POST(mockContext as APIContext);
    const responseData = await response.json();

    // Assert
    expect(response.status).toBe(400);
    expect(responseData.error).toBe("Invalid request body.");
    expect(responseData.details).toBeDefined();
  });

  it("should return 400 when content is missing", async () => {
    // Arrange
    const invalidData = {
      title: "Title without content",
    };

    mockContext.request = new Request("http://localhost/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(invalidData),
    });

    // Act
    const response = await POST(mockContext as APIContext);
    const responseData = await response.json();

    // Assert
    expect(response.status).toBe(400);
    expect(responseData.error).toBe("Invalid request body.");
  });

  it("should return 400 when request body is invalid JSON", async () => {
    // Arrange
    mockContext.request = new Request("http://localhost/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "invalid json{",
    });

    // Act
    const response = await POST(mockContext as APIContext);
    const responseData = await response.json();

    // Assert
    expect(response.status).toBe(400);
    expect(responseData.error).toBe("Invalid JSON in request body.");
  });

  it("should return 500 when database operation fails", async () => {
    // Arrange
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

    const mockError = { message: "Database connection error" };

    const mockSelect = vi.fn().mockReturnValue({
      single: vi.fn().mockResolvedValue({
        data: null,
        error: mockError,
      }),
    });

    const mockInsert = vi.fn().mockReturnValue({
      select: mockSelect,
    });

    mockSupabase.from.mockReturnValue({
      insert: mockInsert,
    });

    // Act
    const response = await POST(mockContext as APIContext);
    const responseData = await response.json();

    // Assert
    expect(response.status).toBe(500);
    expect(responseData.error).toBe("Internal Server Error.");
    expect(responseData.message).toContain("Database connection error");
  });
});

describe("GET /api/notes", () => {
  let mockContext: Partial<APIContext>;
  let mockSupabase: any;

  beforeEach(() => {
    mockSupabase = {
      from: vi.fn(),
    };

    mockContext = {
      url: new URL("http://localhost/api/notes?page=1&page_size=20&sort_by=updated_at&order=desc"),
      locals: {
        supabase: mockSupabase,
        user: { id: "test-user-123" },
      },
    };
  });

  it("should return notes sorted by updated_at desc with newest first", async () => {
    // Arrange
    const mockNotes = [
      {
        id: "note-new",
        title: "Newly Created Note",
        category_id: null,
        created_at: "2025-10-22T12:00:00Z",
        updated_at: "2025-10-22T12:00:00Z",
      },
      {
        id: "note-old",
        title: "Older Note",
        category_id: null,
        created_at: "2025-10-22T10:00:00Z",
        updated_at: "2025-10-22T10:00:00Z",
      },
    ];

    const mockRange = vi.fn().mockResolvedValue({
      data: mockNotes,
      error: null,
      count: 2,
    });

    const mockOrder = vi.fn().mockReturnValue({
      range: mockRange,
    });

    const mockEq = vi.fn().mockReturnValue({
      order: mockOrder,
    });

    const mockSelect = vi.fn().mockReturnValue({
      eq: mockEq,
    });

    mockSupabase.from.mockReturnValue({
      select: mockSelect,
    });

    // Act
    const response = await GET(mockContext as APIContext);
    const responseData = await response.json();

    // Assert
    expect(response.status).toBe(200);
    expect(responseData.data).toEqual(mockNotes);
    expect(responseData.data).toHaveLength(2);
    expect(responseData.data[0].id).toBe("note-new");
    expect(responseData.data[0].title).toBe("Newly Created Note");
    expect(responseData.data[0].updated_at).toBe("2025-10-22T12:00:00Z");
    expect(responseData.pagination).toEqual({
      current_page: 1,
      total_pages: 1,
      total_items: 2,
    });
    expect(mockOrder).toHaveBeenCalledWith("updated_at", { ascending: false });
  });

  it("should return 401 when user is not authenticated", async () => {
    // Arrange
    mockContext.locals = {
      supabase: mockSupabase,
      user: null,
    };

    // Act
    const response = await GET(mockContext as APIContext);
    const responseData = await response.json();

    // Assert
    expect(response.status).toBe(401);
    expect(responseData.error).toBe("Unauthorized. Please log in.");
  });

  it("should handle pagination correctly", async () => {
    // Arrange
    mockContext.url = new URL("http://localhost/api/notes?page=2&page_size=10");

    const mockNotes = [
      {
        id: "note-11",
        title: "Note 11",
        category_id: null,
        created_at: "2025-10-22T11:00:00Z",
        updated_at: "2025-10-22T11:00:00Z",
      },
    ];

    const mockRange = vi.fn().mockResolvedValue({
      data: mockNotes,
      error: null,
      count: 21,
    });

    const mockOrder = vi.fn().mockReturnValue({
      range: mockRange,
    });

    const mockEq = vi.fn().mockReturnValue({
      order: mockOrder,
    });

    const mockSelect = vi.fn().mockReturnValue({
      eq: mockEq,
    });

    mockSupabase.from.mockReturnValue({
      select: mockSelect,
    });

    // Act
    const response = await GET(mockContext as APIContext);
    const responseData = await response.json();

    // Assert
    expect(response.status).toBe(200);
    expect(mockRange).toHaveBeenCalledWith(10, 19);
    expect(responseData.pagination).toEqual({
      current_page: 2,
      total_pages: 3,
      total_items: 21,
    });
  });
});