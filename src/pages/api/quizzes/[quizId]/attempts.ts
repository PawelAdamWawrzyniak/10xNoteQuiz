import type { APIRoute } from "astro";
import { z } from "zod";
import { QuizAttemptService } from "@/lib/services/quiz-attempt.service";

export const prerender = false;

const QuizAttemptsParams = z.object({
  quizId: z.string().uuid(),
});

const SubmitQuizBody = z.object({
  answers: z.array(
    z.object({
      question_id: z.string().uuid(),
      answer: z.union([z.string(), z.array(z.string()), z.null()]),
    })
  ),
});

export const POST: APIRoute = async ({ params, request, locals }) => {
  // Check authentication
  const { user } = locals;
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Validate params
  const paramsValidation = QuizAttemptsParams.safeParse(params);
  if (!paramsValidation.success) {
    return new Response(JSON.stringify({ message: "Invalid quiz ID format" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { quizId } = paramsValidation.data;

  // Parse request body
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ message: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Validate body
  const bodyValidation = SubmitQuizBody.safeParse(body);
  if (!bodyValidation.success) {
    return new Response(JSON.stringify({ message: "Invalid request body", errors: bodyValidation.error.errors }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { answers } = bodyValidation.data;

  // Verify Supabase client
  if (!locals.supabase) {
    return new Response(JSON.stringify({ message: "Internal server error: Database not initialized" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const quizAttemptService = new QuizAttemptService(locals.supabase, user.id);
    const result = await quizAttemptService.submitQuizAttempt(quizId, answers);

    return new Response(JSON.stringify(result), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    // eslint-disable-next-line no-console
    console.error("[QuizAttempt] Error submitting quiz:", error);

    if (errorMessage.includes("not found") || errorMessage.includes("not accessible")) {
      return new Response(JSON.stringify({ message: errorMessage }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ message: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
