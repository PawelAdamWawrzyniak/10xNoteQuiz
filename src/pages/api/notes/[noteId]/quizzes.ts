import type { APIRoute } from "astro";
import { z } from "zod";
import { QuizGenerationService } from "@/lib/services/quiz.service";

export const prerender = false;

const QuizGenerationParams = z.object({
  noteId: z.string().uuid(),
});

export const POST: APIRoute = async ({ params, locals }) => {
  // Check if user is authenticated (set by middleware)
  const { user } = locals;
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const userId = user.id;

  const validationResult = QuizGenerationParams.safeParse(params);
  if (!validationResult.success) {
    return new Response(validationResult.error.message, { status: 400 });
  }

  const { noteId } = validationResult.data;

  // Debug: Check if supabase client is available
  if (!locals.supabase) {
    console.error("Supabase client is not available in locals");
    return new Response("Internal server error: Supabase client not initialized", { status: 500 });
  }

  const quizGenerationService = new QuizGenerationService(locals.supabase, userId);

  try {
    const quiz = await quizGenerationService.generateQuizForNote(noteId);
    return new Response(JSON.stringify(quiz), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Enhanced error handling with stack trace
    console.error("Error generating quiz:", error);
    if (error instanceof Error) {
      return new Response(JSON.stringify({ error: error.message, stack: error.stack }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response("An unknown error occurred", { status: 500 });
  }
};
