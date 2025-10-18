import type { APIRoute } from "astro";

import { GetNotesQuerySchema, CreateNoteSchema } from "../../../lib/schemas/note.schemas";
import { findNotes, createNote } from "../../../lib/services/notes.service";

export const prerender = false;

/**
 * GET /api/notes
 * Lists all notes for the authenticated user with pagination, sorting, and filtering.
 */
export const GET: APIRoute = async ({ url, locals }) => {
  const { supabase, user } = locals;

  // Check if Supabase client is available
  if (!supabase) {
    return new Response(JSON.stringify({ error: "Supabase client is not available." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Check if user is authenticated
  if (!user?.id) {
    return new Response(JSON.stringify({ error: "Unauthorized. Please log in." }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Extract query parameters from URL
  const queryParams = {
    page: url.searchParams.get("page"),
    page_size: url.searchParams.get("page_size"),
    sort_by: url.searchParams.get("sort_by"),
    order: url.searchParams.get("order"),
    category_id: url.searchParams.get("category_id"),
    tag_id: url.searchParams.get("tag_id"),
  };

  // Validate query parameters using Zod schema
  const validationResult = GetNotesQuerySchema.safeParse(queryParams);

  if (!validationResult.success) {
    return new Response(
      JSON.stringify({
        error: "Invalid query parameters.",
        details: validationResult.error.flatten(),
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    // Fetch notes using the service
    const result = await findNotes(supabase, user.id, validationResult.data);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Log error for debugging (in production, use proper logging service)
    // eslint-disable-next-line no-console
    console.error("Error fetching notes:", error);
    return new Response(
      JSON.stringify({
        error: "Internal Server Error.",
        message: error instanceof Error ? error.message : "Unknown error occurred.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

/**
 * POST /api/notes
 * Creates a new note for the authenticated user.
 */
export const POST: APIRoute = async ({ request, locals }) => {
  const { supabase, user } = locals;

  // Check if Supabase client is available
  if (!supabase) {
    return new Response(JSON.stringify({ error: "Supabase client is not available." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Check if user is authenticated
  if (!user?.id) {
    return new Response(JSON.stringify({ error: "Unauthorized. Please log in." }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Parse request body
  let requestBody;
  try {
    requestBody = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON in request body." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Validate request body using Zod schema
  const validationResult = CreateNoteSchema.safeParse(requestBody);

  if (!validationResult.success) {
    return new Response(
      JSON.stringify({
        error: "Invalid request body.",
        details: validationResult.error.flatten(),
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    // Create note using the service
    const createdNote = await createNote(supabase, user.id, validationResult.data);

    return new Response(JSON.stringify(createdNote), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Log error for debugging (in production, use proper logging service)
    // eslint-disable-next-line no-console
    console.error("Error creating note:", error);
    return new Response(
      JSON.stringify({
        error: "Internal Server Error.",
        message: error instanceof Error ? error.message : "Unknown error occurred.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
