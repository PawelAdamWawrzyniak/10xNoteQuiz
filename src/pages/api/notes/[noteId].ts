import { z } from "zod";
import type { APIRoute } from "astro";

import { findNoteById } from "../../../lib/services/notes.service";

export const prerender = false;

const noteIdSchema = z.string().uuid({ message: "Note ID must be a valid UUID." });

export const GET: APIRoute = async ({ params, locals }) => {
  const { supabase } = locals;
  const { noteId } = params;

  if (!supabase) {
    return new Response(JSON.stringify({ error: "Supabase client is not available." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const validationResult = noteIdSchema.safeParse(noteId);

  if (!validationResult.success) {
    return new Response(JSON.stringify({ error: validationResult.error.flatten() }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const note = await findNoteById(supabase, validationResult.data);

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
    console.error("Error fetching note:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
