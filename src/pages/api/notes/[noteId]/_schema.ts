import type { JSONSchema } from "@/types";

/**
 * JSON Schema for quiz generation response.
 * Defines the expected structure of a quiz created by the AI model.
 */
export const quizSchema = {
  type: "object",
  properties: {
    title: {
      type: "string",
      description: "Tytuł quizu wygenerowany na podstawie treści notatki.",
    },
    questions: {
      type: "array",
      description: "Lista pytań w quizie.",
      items: {
        type: "object",
        properties: {
          type: {
            type: "string",
            enum: ["true_false", "multiple_choice", "short_answer"],
            description: "Typ pytania.",
          },
          question_text: {
            type: "string",
            description: "Treść pytania.",
          },
          options: {
            type: "array",
            items: { type: "string" },
            description: "Lista możliwych odpowiedzi (dla multiple_choice i true_false).",
          },
          correct_answer: {
            type: "string",
            description: "Poprawna odpowiedź.",
          },
        },
        required: ["type", "question_text", "correct_answer"],
      },
    },
  },
  required: ["title", "questions"],
} as const satisfies JSONSchema;
