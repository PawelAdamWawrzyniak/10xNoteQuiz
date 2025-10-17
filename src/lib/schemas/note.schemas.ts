import { z } from "zod";

/**
 * Schema for validating query parameters for GET /api/notes
 */
export const GetNotesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  page_size: z.coerce.number().int().min(1).max(100).default(20),
  sort_by: z.string().optional().default("updated_at"),
  order: z.enum(["asc", "desc"]).optional().default("desc"),
  category_id: z.string().uuid().optional(),
  tag_id: z.string().uuid().optional(),
});

export type GetNotesQuery = z.infer<typeof GetNotesQuerySchema>;

/**
 * Schema for validating path parameters for note endpoints
 */
export const NotePathParamsSchema = z.object({
  noteId: z.string().uuid(),
});

export type NotePathParams = z.infer<typeof NotePathParamsSchema>;

/**
 * Schema for validating POST /api/notes request body
 */
export const CreateNoteSchema = z.object({
  title: z.string().min(1).max(500),
  content: z.string().min(1),
  category_id: z.string().uuid().nullable().optional(),
  tag_ids: z.array(z.string().uuid()).optional().default([]),
});

export type CreateNoteInput = z.infer<typeof CreateNoteSchema>;

/**
 * Schema for validating PATCH /api/notes/{noteId} request body
 * All fields are optional for partial updates
 */
export const UpdateNoteSchema = z.object({
  title: z.string().min(1).max(500).optional(),
  content: z.string().min(1).optional(),
  category_id: z.string().uuid().nullable().optional(),
  tag_ids: z.array(z.string().uuid()).optional(),
});

export type UpdateNoteInput = z.infer<typeof UpdateNoteSchema>;

