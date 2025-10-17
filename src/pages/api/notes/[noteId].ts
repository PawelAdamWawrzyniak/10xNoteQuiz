import type { APIRoute } from "astro";

import { NotePathParamsSchema, UpdateNoteSchema } from "../../../lib/schemas/note.schemas";
import { findNoteById, updateNote, deleteNote } from "../../../lib/services/notes.service";

export const prerender = false;

/**
 * GET /api/notes/{noteId}
 * Retrieves a single note by ID for the authenticated user.
 */
export const GET: APIRoute = async ({ params, locals }) => {
  const { supabase, user } = locals;

  if (!supabase) {
    return new Response(JSON.stringify({ error: "Supabase client is not available." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!user?.id) {
    return new Response(JSON.stringify({ error: "Unauthorized. Please log in." }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Validate path parameters using Zod schema
  const validationResult = NotePathParamsSchema.safeParse(params);

  if (!validationResult.success) {
    return new Response(
      JSON.stringify({
        error: "Invalid path parameters.",
        details: validationResult.error.flatten(),
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const note = await findNoteById(supabase, validationResult.data.noteId, user.id);

    if (!note) {
      return new Response(JSON.stringify({ error: "Note not found." }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(note), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Log error for debugging (in production, use proper logging service)
    // eslint-disable-next-line no-console
    console.error("Error fetching note:", error);
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
 * PATCH /api/notes/{noteId}
 * Updates an existing note for the authenticated user.
 * Supports partial updates - all fields are optional.
 */
export const PATCH: APIRoute = async ({ params, request, locals }) => {
  const { supabase, user } = locals;

  if (!supabase) {
    return new Response(JSON.stringify({ error: "Supabase client is not available." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!user?.id) {
    return new Response(JSON.stringify({ error: "Unauthorized. Please log in." }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Validate path parameters using Zod schema
  const pathValidation = NotePathParamsSchema.safeParse(params);

  if (!pathValidation.success) {
    return new Response(
      JSON.stringify({
        error: "Invalid path parameters.",
        details: pathValidation.error.flatten(),
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
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
  const bodyValidation = UpdateNoteSchema.safeParse(requestBody);

  if (!bodyValidation.success) {
    return new Response(
      JSON.stringify({
        error: "Invalid request body.",
        details: bodyValidation.error.flatten(),
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const updatedNote = await updateNote(supabase, pathValidation.data.noteId, user.id, bodyValidation.data);

    if (!updatedNote) {
      return new Response(JSON.stringify({ error: "Note not found." }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(updatedNote), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Log error for debugging (in production, use proper logging service)
    // eslint-disable-next-line no-console
    console.error("Error updating note:", error);
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
 * DELETE /api/notes/{noteId}
 * Deletes a note for the authenticated user.
 */
export const DELETE: APIRoute = async ({ params, locals }) => {
  const { supabase, user } = locals;

  if (!supabase) {
    return new Response(JSON.stringify({ error: "Supabase client is not available." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!user?.id) {
    return new Response(JSON.stringify({ error: "Unauthorized. Please log in." }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Validate path parameters using Zod schema
  const validationResult = NotePathParamsSchema.safeParse(params);

  if (!validationResult.success) {
    return new Response(
      JSON.stringify({
        error: "Invalid path parameters.",
        details: validationResult.error.flatten(),
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const deleted = await deleteNote(supabase, validationResult.data.noteId, user.id);

    if (!deleted) {
      return new Response(JSON.stringify({ error: "Note not found." }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Return 204 No Content on successful deletion
    return new Response(null, {
      status: 204,
    });
  } catch (error) {
    // Log error for debugging (in production, use proper logging service)
    // eslint-disable-next-line no-console
    console.error("Error deleting note:", error);
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
