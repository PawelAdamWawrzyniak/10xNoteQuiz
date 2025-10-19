import type { APIRoute } from "astro";
import { z } from "zod";
import { QuizGenerationService } from "@/lib/services/quiz.service";
import {
  OpenRouterError,
  AuthenticationError,
  RateLimitError,
  ServiceUnavailableError,
  ModelResponseError,
} from "@/lib/services/openrouter.errors";

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

  // Validate request parameters
  const validationResult = QuizGenerationParams.safeParse(params);
  if (!validationResult.success) {
    return new Response(JSON.stringify({ message: "Invalid note ID format" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { noteId } = validationResult.data;

  // Verify Supabase client availability
  if (!locals.supabase) {
    // eslint-disable-next-line no-console
    console.error("Supabase client is not available in locals");
    return new Response(JSON.stringify({ message: "Internal server error: Database not initialized" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const quizGenerationService = new QuizGenerationService(locals.supabase, userId);

  try {
    const quiz = await quizGenerationService.generateQuizForNote(noteId);
    return new Response(JSON.stringify(quiz), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error generating quiz:", error);

    // Handle OpenRouter-specific errors
    if (error instanceof AuthenticationError) {
      return new Response(
        JSON.stringify({ message: "AI service authentication failed. Please check API key configuration." }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    if (error instanceof RateLimitError) {
      return new Response(JSON.stringify({ message: "AI service rate limit exceeded. Please try again later." }), {
        status: 429,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (error instanceof ServiceUnavailableError) {
      return new Response(
        JSON.stringify({ message: "AI service is temporarily unavailable. Please try again later." }),
        {
          status: 503,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (error instanceof ModelResponseError) {
      return new Response(
        JSON.stringify({
          message: error.message || "AI generated an invalid response. Please try regenerating the quiz.",
        }),
        { status: 422, headers: { "Content-Type": "application/json" } }
      );
    }

    if (error instanceof OpenRouterError) {
      return new Response(JSON.stringify({ message: `AI service error: ${error.message}` }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Handle application-specific errors
    if (error instanceof Error) {
      // Check for known error messages
      if (error.message.includes("not found") || error.message.includes("access denied")) {
        return new Response(JSON.stringify({ message: "Note not found or access denied" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (error.message.includes("too short")) {
        return new Response(JSON.stringify({ message: error.message }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Generic error response
      return new Response(JSON.stringify({ message: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Unknown error
    return new Response(JSON.stringify({ message: "An unexpected error occurred" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
