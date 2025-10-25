import { describe, it, expect, vi, beforeEach } from "vitest";
import { createNote, findNotes } from "../notes.service";
import type { CreateNoteInput } from "../../schemas/note.schemas";
import type { SupabaseClient } from "../../../db/supabase.client";

describe("notes.service", () => {
  describe("createNote", () => {
    let mockSupabase: SupabaseClient;
    const userId = "test-user-123";

    beforeEach(() => {
      // Arrange: Create mock Supabase client for each test
      mockSupabase = {
        from: vi.fn(),
      } as unknown as SupabaseClient;
    });

    it("should create a note with title and content", async () => {
      // Arrange
      const noteInput: CreateNoteInput = {
        title: "Test Note",
        content: "This is test content",
        category_id: null,
        tag_ids: [],
      };

      const mockCreatedNote = {
        id: "note-123",
        user_id: userId,
        title: noteInput.title,
        content: noteInput.content,
        category_id: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
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

      // Mock the findNoteById query (for fetching created note)
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

      (mockSupabase.from as any).mockImplementation((table: string) => {
        if (table === "notes") {
          return {
            insert: mockInsert,
            select: mockSelectQuery,
          };
        }
        return {};
      });

      // Act
      const result = await createNote(mockSupabase, userId, noteInput);

      // Assert
      expect(mockSupabase.from).toHaveBeenCalledWith("notes");
      expect(mockInsert).toHaveBeenCalledWith({
        user_id: userId,
        title: noteInput.title,
        content: noteInput.content,
        category_id: null,
      });
      expect(result).toEqual(mockNoteWithTags);
      expect(result.title).toBe(noteInput.title);
      expect(result.content).toBe(noteInput.content);
      expect(result.user_id).toBe(userId);
    });

    it("should create a note and associate tags when tag_ids provided", async () => {
      // Arrange
      const noteInput: CreateNoteInput = {
        title: "Test Note with Tags",
        content: "Content",
        category_id: null,
        tag_ids: ["tag-1", "tag-2"],
      };

      const mockCreatedNote = {
        id: "note-456",
        user_id: userId,
        title: noteInput.title,
        content: noteInput.content,
        category_id: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const mockNoteWithTags = {
        ...mockCreatedNote,
        tags: [
          { id: "tag-1", name: "Tag 1" },
          { id: "tag-2", name: "Tag 2" },
        ],
        srs_data: null,
        note_tags: [{ tags: { id: "tag-1", name: "Tag 1" } }, { tags: { id: "tag-2", name: "Tag 2" } }],
      };

      // Mock the insert chain for notes
      const mockSelect = vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({
          data: mockCreatedNote,
          error: null,
        }),
      });

      const mockInsert = vi.fn().mockReturnValue({
        select: mockSelect,
      });

      // Mock the insert for note_tags
      const mockNoteTagsInsert = vi.fn().mockResolvedValue({
        data: null,
        error: null,
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

      (mockSupabase.from as any).mockImplementation((table: string) => {
        if (table === "notes") {
          return {
            insert: mockInsert,
            select: mockSelectQuery,
          };
        }
        if (table === "note_tags") {
          return {
            insert: mockNoteTagsInsert,
          };
        }
        return {};
      });

      // Act
      const result = await createNote(mockSupabase, userId, noteInput);

      // Assert
      expect(mockSupabase.from).toHaveBeenCalledWith("notes");
      expect(mockSupabase.from).toHaveBeenCalledWith("note_tags");
      expect(mockNoteTagsInsert).toHaveBeenCalledWith([
        { note_id: mockCreatedNote.id, tag_id: "tag-1" },
        { note_id: mockCreatedNote.id, tag_id: "tag-2" },
      ]);
      expect(result.tags).toHaveLength(2);
      expect(result.tags[0].id).toBe("tag-1");
      expect(result.tags[1].id).toBe("tag-2");
    });

    it("should throw error when note creation fails", async () => {
      // Arrange
      const noteInput: CreateNoteInput = {
        title: "Test",
        content: "Content",
        category_id: null,
        tag_ids: [],
      };

      const mockError = { message: "Database connection failed" };

      const mockSelect = vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({
          data: null,
          error: mockError,
        }),
      });

      const mockInsert = vi.fn().mockReturnValue({
        select: mockSelect,
      });

      (mockSupabase.from as any).mockReturnValue({
        insert: mockInsert,
      });

      // Act & Assert
      await expect(createNote(mockSupabase, userId, noteInput)).rejects.toThrow(
        "Error creating note: Database connection failed"
      );
    });
  });

  describe("findNotes", () => {
    let mockSupabase: SupabaseClient;
    const userId = "test-user-123";

    beforeEach(() => {
      mockSupabase = {
        from: vi.fn(),
      } as unknown as SupabaseClient;
    });

    it("should return paginated notes sorted by updated_at desc by default", async () => {
      // Arrange
      const query = {
        page: 1,
        page_size: 20,
        sort_by: "updated_at" as const,
        order: "desc" as const,
      };

      const mockNotes = [
        {
          id: "note-1",
          title: "Latest Note",
          category_id: null,
          created_at: "2025-10-22T10:00:00Z",
          updated_at: "2025-10-22T12:00:00Z",
        },
        {
          id: "note-2",
          title: "Older Note",
          category_id: null,
          created_at: "2025-10-21T10:00:00Z",
          updated_at: "2025-10-21T12:00:00Z",
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

      (mockSupabase.from as any).mockReturnValue({
        select: mockSelect,
      });

      // Act
      const result = await findNotes(mockSupabase, userId, query);

      // Assert
      expect(mockSupabase.from).toHaveBeenCalledWith("notes");
      expect(mockSelect).toHaveBeenCalledWith("id, title, category_id, created_at, updated_at", {
        count: "exact",
      });
      expect(mockEq).toHaveBeenCalledWith("user_id", userId);
      expect(mockOrder).toHaveBeenCalledWith("updated_at", { ascending: false });
      expect(mockRange).toHaveBeenCalledWith(0, 19);
      expect(result.data).toEqual(mockNotes);
      expect(result.pagination).toEqual({
        current_page: 1,
        total_pages: 1,
        total_items: 2,
      });
      expect(result.data[0].title).toBe("Latest Note");
    });

    it("should return newly created note as first item when sorted by updated_at desc", async () => {
      // Arrange
      const query = {
        page: 1,
        page_size: 20,
        sort_by: "updated_at" as const,
        order: "desc" as const,
      };

      const newNoteTime = "2025-10-22T12:00:00Z";
      const olderNoteTime = "2025-10-22T11:00:00Z";

      const mockNotes = [
        {
          id: "note-new",
          title: "Newly Created Note",
          category_id: null,
          created_at: newNoteTime,
          updated_at: newNoteTime,
        },
        {
          id: "note-old",
          title: "Existing Note",
          category_id: null,
          created_at: olderNoteTime,
          updated_at: olderNoteTime,
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

      (mockSupabase.from as any).mockReturnValue({
        select: mockSelect,
      });

      // Act
      const result = await findNotes(mockSupabase, userId, query);

      // Assert
      expect(result.data).toHaveLength(2);
      expect(result.data[0].id).toBe("note-new");
      expect(result.data[0].title).toBe("Newly Created Note");
      expect(result.data[0].updated_at).toBe(newNoteTime);
    });
  });
});
