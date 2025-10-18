import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  NotesFilterViewModel,
  NoteFormViewModel,
  NoteDetailsDto,
  NoteListItemDto,
  PaginatedResponseDto,
} from "@/types";

/**
 * Fetches a paginated list of notes from the API
 */
const fetchNotes = async (filters: NotesFilterViewModel): Promise<PaginatedResponseDto<NoteListItemDto>> => {
  const params = new URLSearchParams({
    page: filters.page.toString(),
    page_size: filters.pageSize.toString(),
    sort_by: filters.sortBy,
    order: filters.order,
  });

  if (filters.categoryId) {
    params.append("category_id", filters.categoryId);
  }

  if (filters.tagId) {
    params.append("tag_id", filters.tagId);
  }

  const response = await fetch(`/api/notes?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Failed to fetch notes" }));
    throw new Error(errorData.message || "Failed to fetch notes");
  }

  return response.json();
};

/**
 * Fetches a single note by ID from the API
 */
const fetchNote = async (noteId: string): Promise<NoteDetailsDto> => {
  const response = await fetch(`/api/notes/${noteId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Failed to fetch note" }));
    throw new Error(errorData.message || "Failed to fetch note");
  }

  return response.json();
};

/**
 * Creates a new note via the API
 */
const createNote = async (data: NoteFormViewModel): Promise<NoteDetailsDto> => {
  const response = await fetch("/api/notes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: data.title,
      content: data.content,
      category_id: data.categoryId,
      tag_ids: data.tags.map((tag) => tag.id),
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Failed to create note" }));
    throw new Error(errorData.message || "Failed to create note");
  }

  return response.json();
};

/**
 * Updates an existing note via the API
 */
const updateNote = async ({ noteId, data }: { noteId: string; data: NoteFormViewModel }): Promise<NoteDetailsDto> => {
  const response = await fetch(`/api/notes/${noteId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: data.title,
      content: data.content,
      category_id: data.categoryId,
      tag_ids: data.tags.map((tag) => tag.id),
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Failed to update note" }));
    throw new Error(errorData.message || "Failed to update note");
  }

  return response.json();
};

/**
 * Deletes a note via the API
 */
const deleteNote = async (noteId: string): Promise<void> => {
  const response = await fetch(`/api/notes/${noteId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Failed to delete note" }));
    throw new Error(errorData.message || "Failed to delete note");
  }
};

/**
 * Hook for querying paginated notes list with filters
 */
export const useNotesQuery = (filters: NotesFilterViewModel) => {
  return useQuery({
    queryKey: ["notes", filters],
    queryFn: () => fetchNotes(filters),
    staleTime: 30000, // 30 seconds
  });
};

/**
 * Hook for querying a single note by ID
 */
export const useNoteQuery = (noteId: string | undefined) => {
  return useQuery({
    queryKey: ["note", noteId],
    queryFn: () => {
      if (!noteId) throw new Error("Note ID is required");
      return fetchNote(noteId);
    },
    enabled: !!noteId,
    staleTime: 30000, // 30 seconds
  });
};

/**
 * Hook for creating a new note with optimistic updates
 */
export const useCreateNoteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      // Invalidate notes list to refetch
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
};

/**
 * Hook for updating an existing note with optimistic updates
 */
export const useUpdateNoteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateNote,
    onSuccess: (data, variables) => {
      // Invalidate notes list and specific note queries
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["note", variables.noteId] });
    },
  });
};

/**
 * Hook for deleting a note with cache cleanup
 */
export const useDeleteNoteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteNote,
    onSuccess: (_, noteId) => {
      // Remove the specific note from cache
      queryClient.removeQueries({ queryKey: ["note", noteId] });
      // Invalidate notes list to refetch
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
};
