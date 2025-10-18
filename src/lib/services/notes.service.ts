import type { SupabaseClient } from "../../db/supabase.client.ts";
import type { NoteDetailsDto, NoteListItemDto, PaginatedResponseDto } from "../../types";
import type { GetNotesQuery, CreateNoteInput, UpdateNoteInput } from "../schemas/note.schemas";

/**
 * Finds a single note by its ID and user ID, returns detailed information.
 * @param supabase The Supabase client instance.
 * @param noteId The UUID of the note to find.
 * @param userId The UUID of the user who owns the note.
 * @returns A promise that resolves to a NoteDetailsDto object or null if not found or unauthorized.
 * @throws An error if the database query fails.
 */
export const findNoteById = async (
  supabase: SupabaseClient,
  noteId: string,
  userId: string
): Promise<NoteDetailsDto | null> => {
  const { data, error } = await supabase
    .from("notes")
    .select(
      "id, user_id, category_id, title, content, created_at, updated_at, srs_data(due_date, interval, ease_factor), note_tags(tags(id, name))"
    )
    .eq("id", noteId)
    .eq("user_id", userId)
    .single();

  if (error) {
    // Return null for not found to avoid leaking information
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(`Error fetching note by ID: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  // Transform note_tags junction table data to flat tags array
  const tags = Array.isArray(data.note_tags)
    ? data.note_tags.map((nt: any) => nt.tags).filter((tag: any) => tag !== null)
    : [];

  const noteDetails: NoteDetailsDto = {
    id: data.id,
    user_id: data.user_id,
    category_id: data.category_id,
    title: data.title,
    content: data.content,
    tags: tags,
    srs_data: data.srs_data || null,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };

  return noteDetails;
};

/**
 * Finds all notes for a user with pagination, sorting, and filtering.
 * @param supabase The Supabase client instance.
 * @param userId The UUID of the user.
 * @param query Query parameters for filtering, sorting, and pagination.
 * @returns A promise that resolves to a paginated response of note list items.
 * @throws An error if the database query fails.
 */
export const findNotes = async (
  supabase: SupabaseClient,
  userId: string,
  query: GetNotesQuery
): Promise<PaginatedResponseDto<NoteListItemDto>> => {
  const { page, page_size, sort_by, order, category_id, tag_id } = query;

  // Calculate offset for pagination
  const offset = (page - 1) * page_size;

  // Build base query
  let notesQuery = supabase
    .from("notes")
    .select("id, title, category_id, created_at, updated_at", { count: "exact" })
    .eq("user_id", userId);

  // Apply filters
  if (category_id) {
    notesQuery = notesQuery.eq("category_id", category_id);
  }

  if (tag_id) {
    // Join with note_tags to filter by tag
    notesQuery = notesQuery
      .select("id, title, category_id, created_at, updated_at, note_tags!inner(tag_id)", {
        count: "exact",
      })
      .eq("note_tags.tag_id", tag_id);
  }

  // Apply sorting
  notesQuery = notesQuery.order(sort_by, { ascending: order === "asc" });

  // Apply pagination
  notesQuery = notesQuery.range(offset, offset + page_size - 1);

  const { data, error, count } = await notesQuery;

  if (error) {
    throw new Error(`Error fetching notes: ${error.message}`);
  }

  const total_items = count || 0;
  const total_pages = Math.ceil(total_items / page_size);

  return {
    data: data || [],
    pagination: {
      current_page: page,
      total_pages,
      total_items,
    },
  };
};

/**
 * Creates a new note for a user.
 * @param supabase The Supabase client instance.
 * @param userId The UUID of the user creating the note.
 * @param input The note data to create.
 * @returns A promise that resolves to the created note details.
 * @throws An error if the database operation fails.
 */
export const createNote = async (
  supabase: SupabaseClient,
  userId: string,
  input: CreateNoteInput
): Promise<NoteDetailsDto> => {
  const { title, content, category_id, tag_ids } = input;

  // Insert the note
  const { data: noteData, error: noteError } = await supabase
    .from("notes")
    .insert({
      user_id: userId,
      title,
      content,
      category_id: category_id || null,
    })
    .select("id, user_id, category_id, title, content, created_at, updated_at")
    .single();

  if (noteError || !noteData) {
    throw new Error(`Error creating note: ${noteError?.message || "Unknown error"}`);
  }

  // Insert tag associations if provided
  if (tag_ids && tag_ids.length > 0) {
    const noteTagsData = tag_ids.map((tag_id) => ({
      note_id: noteData.id,
      tag_id,
    }));

    const { error: tagsError } = await supabase.from("note_tags").insert(noteTagsData);

    if (tagsError) {
      // Consider rolling back the note creation or logging the error
      console.error("Error associating tags with note:", tagsError);
    }
  }

  // Fetch the complete note with tags
  const createdNote = await findNoteById(supabase, noteData.id, userId);

  if (!createdNote) {
    throw new Error("Error retrieving created note");
  }

  return createdNote;
};

/**
 * Updates an existing note for a user.
 * @param supabase The Supabase client instance.
 * @param noteId The UUID of the note to update.
 * @param userId The UUID of the user who owns the note.
 * @param input The note data to update (partial).
 * @returns A promise that resolves to the updated note details or null if not found/unauthorized.
 * @throws An error if the database operation fails.
 */
export const updateNote = async (
  supabase: SupabaseClient,
  noteId: string,
  userId: string,
  input: UpdateNoteInput
): Promise<NoteDetailsDto | null> => {
  const { title, content, category_id, tag_ids } = input;

  // First, verify the note exists and belongs to the user
  const existingNote = await findNoteById(supabase, noteId, userId);
  if (!existingNote) {
    return null;
  }

  // Prepare update data (only include provided fields)
  const updateData: any = {};
  if (title !== undefined) updateData.title = title;
  if (content !== undefined) updateData.content = content;
  if (category_id !== undefined) updateData.category_id = category_id;

  // Update the note if there are fields to update
  if (Object.keys(updateData).length > 0) {
    const { error: updateError } = await supabase
      .from("notes")
      .update(updateData)
      .eq("id", noteId)
      .eq("user_id", userId);

    if (updateError) {
      throw new Error(`Error updating note: ${updateError.message}`);
    }
  }

  // Update tags if provided
  if (tag_ids !== undefined) {
    // Delete existing tag associations
    const { error: deleteError } = await supabase.from("note_tags").delete().eq("note_id", noteId);

    if (deleteError) {
      throw new Error(`Error removing old tags: ${deleteError.message}`);
    }

    // Insert new tag associations
    if (tag_ids.length > 0) {
      const noteTagsData = tag_ids.map((tag_id) => ({
        note_id: noteId,
        tag_id,
      }));

      const { error: insertError } = await supabase.from("note_tags").insert(noteTagsData);

      if (insertError) {
        throw new Error(`Error associating new tags: ${insertError.message}`);
      }
    }
  }

  // Fetch and return the updated note
  const updatedNote = await findNoteById(supabase, noteId, userId);
  return updatedNote;
};

/**
 * Deletes a note for a user.
 * @param supabase The Supabase client instance.
 * @param noteId The UUID of the note to delete.
 * @param userId The UUID of the user who owns the note.
 * @returns A promise that resolves to true if deleted, false if not found/unauthorized.
 * @throws An error if the database operation fails.
 */
export const deleteNote = async (supabase: SupabaseClient, noteId: string, userId: string): Promise<boolean> => {
  // First verify the note exists and belongs to the user
  const existingNote = await findNoteById(supabase, noteId, userId);
  if (!existingNote) {
    return false;
  }

  // Delete the note (cascade should handle related records)
  const { error } = await supabase.from("notes").delete().eq("id", noteId).eq("user_id", userId);

  if (error) {
    throw new Error(`Error deleting note: ${error.message}`);
  }

  return true;
};
