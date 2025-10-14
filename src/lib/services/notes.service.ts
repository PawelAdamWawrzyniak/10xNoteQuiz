import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "../../db/database.types";
import type { NoteDetailsDto } from "../../types";

/**
 * Finds a single note by its ID and returns detailed information.
 * @param supabase The Supabase client instance.
 * @param noteId The UUID of the note to find.
 * @returns A promise that resolves to a NoteDetailsDto object or null if not found.
 * @throws An error if the database query fails.
 */
export const findNoteById = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  supabase: SupabaseClient<Database>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  noteId: string
): Promise<NoteDetailsDto | null> => {
  // --- MOCKED IMPLEMENTATION ---
  const mockedNote: NoteDetailsDto = {
    id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    user_id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12",
    category_id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13",
    title: "Mocked Note: Astro for Beginners",
    content:
      "This is a mocked note about Astro. It supports **Markdown** and is great for testing the UI without a live database connection.",
    tags: [
      { id: "tag-1", name: "astro" },
      { id: "tag-2", name: "testing" },
      { id: "tag-3", name: "mock" },
    ],
    srs_data: {
      due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      interval: 1,
      ease_factor: 2.5,
    },
    created_at: new Date("2025-10-13T10:00:00Z").toISOString(),
    updated_at: new Date("2025-10-13T12:30:00Z").toISOString(),
  };

  return Promise.resolve(mockedNote);

  // --- ORIGINAL IMPLEMENTATION ---
  /*
	const { data, error } = await supabase
		.from("notes")
		.select(
			"id, user_id, category_id, title, content, created_at, updated_at, srs_data(due_date, interval, ease_factor), tags(id, name)",
		)
		.eq("id", noteId)
		.single();

	if (error) {
		throw new Error(`Error fetching note by ID: ${error.message}`);
	}

	if (!data) {
		return null;
	}

	const noteDetails: NoteDetailsDto = {
		id: data.id,
		user_id: data.user_id,
		category_id: data.category_id,
		title: data.title,
		content: data.content,
		tags: Array.isArray(data.tags) ? data.tags : [],
		srs_data: data.srs_data,
		created_at: data.created_at,
		updated_at: data.updated_at,
	};

	return noteDetails;
	*/
};
