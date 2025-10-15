import type { APIRoute } from "astro";

// This is a mock endpoint for deleting/rejecting a quiz.
// In a real application, this would delete the quiz from the database.
export const DELETE: APIRoute = async ({ params }) => {
  const { quizId } = params;

  if (!quizId) {
    return new Response(JSON.stringify({ message: "Quiz ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  console.log(`[MOCK] Deleting quiz with ID: ${quizId}`);

  // Simulate a successful deletion
  return new Response(
    JSON.stringify({
      message: "Quiz rejected successfully",
      quizId,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
};
