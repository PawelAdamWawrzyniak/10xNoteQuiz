import type { APIRoute } from "astro";

// This is a mock endpoint for accepting a quiz.
// In a real application, this would update the quiz status in the database.
export const POST: APIRoute = async ({ params }) => {
  const { quizId } = params;

  if (!quizId) {
    return new Response(JSON.stringify({ message: "Quiz ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  console.log(`[MOCK] Accepting quiz with ID: ${quizId}`);

  // Simulate a successful response
  return new Response(
    JSON.stringify({
      message: "Quiz accepted successfully",
      quizId,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
};
