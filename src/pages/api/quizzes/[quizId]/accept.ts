import type { APIRoute } from "astro";
import { z } from "zod";

export const prerender = false;

const QuizAcceptParams = z.object({
  quizId: z.string().uuid(),
});

export const POST: APIRoute = async ({ params, locals }) => {
  // Check if user is authenticated (set by middleware)
  const { user } = locals;
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const userId = user.id;

  // Validate request parameters
  const validationResult = QuizAcceptParams.safeParse(params);
  if (!validationResult.success) {
    return new Response(JSON.stringify({ message: "Invalid quiz ID format" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { quizId } = validationResult.data;

  // Verify Supabase client availability
  if (!locals.supabase) {
    // eslint-disable-next-line no-console
    console.error("Supabase client is not available in locals");
    return new Response(JSON.stringify({ message: "Internal server error: Database not initialized" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // First, verify that the quiz exists and belongs to the user
    const { data: quiz, error: quizError } = await locals.supabase
      .from("quizzes")
      .select(
        `
        id,
        status,
        note_id,
        notes!inner(user_id)
      `
      )
      .eq("id", quizId)
      .eq("notes.user_id", userId)
      .single();

    if (quizError || !quiz) {
      return new Response(JSON.stringify({ message: "Quiz not found or access denied" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check if quiz is in pending_acceptance status
    if (quiz.status !== "pending_acceptance") {
      return new Response(
        JSON.stringify({
          message: `Quiz is not in pending acceptance status. Current status: ${quiz.status}`,
        }),
        {
          status: 409,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Update quiz status to accepted
    const { data: updatedQuiz, error: updateError } = await locals.supabase
      .from("quizzes")
      .update({ status: "accepted" })
      .eq("id", quizId)
      .select("id, status, created_at")
      .single();

    if (updateError) {
      // eslint-disable-next-line no-console
      console.error("Error updating quiz status:", updateError);
      return new Response(JSON.stringify({ message: "Failed to accept quiz" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // eslint-disable-next-line no-console
    console.log(`[QuizAccept] Successfully accepted quiz ${quizId} for user ${userId}`);

    return new Response(
      JSON.stringify({
        message: "Quiz accepted successfully",
        quiz: updatedQuiz,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error accepting quiz:", error);
    return new Response(JSON.stringify({ message: "An unexpected error occurred" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
