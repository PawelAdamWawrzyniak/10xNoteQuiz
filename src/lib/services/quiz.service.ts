import type { SupabaseClient } from "@/db/supabase.client";
import type { QuizGenerationResponseDto, QuizQuestionDto } from "@/types";
import type { Json } from "@/db/database.types";
import { OpenRouterService } from "./openrouter.service";
import { OpenRouterError } from "./openrouter.errors";
import { quizSchema } from "@/pages/api/notes/[noteId]/_schema";

/**
 * Response structure expected from AI model for quiz generation.
 */
interface AIQuizResponse {
  title: string;
  questions: {
    type: "true_false" | "multiple_choice" | "short_answer";
    question_text: string;
    options?: string[];
    correct_answer: string;
  }[];
}

export class QuizGenerationService {
  private supabase: SupabaseClient;
  private userId: string;
  private openRouterService: OpenRouterService;

  constructor(supabase: SupabaseClient, userId: string) {
    this.supabase = supabase;
    this.userId = userId;
    this.openRouterService = new OpenRouterService();
  }

  public async generateQuizForNote(noteId: string): Promise<QuizGenerationResponseDto> {
    // Step 1: Fetch note content from database
    const { data: note, error: noteError } = await this.supabase
      .from("notes")
      .select("content, title")
      .eq("id", noteId)
      .eq("user_id", this.userId)
      .single();

    if (noteError || !note) {
      throw new Error("Note not found or access denied.");
    }

    if (note.content.length < 100) {
      throw new Error("Note content is too short to generate a quiz. Minimum 100 characters required.");
    }

    // Step 2: Generate quiz using AI via OpenRouter
    let aiQuizResponse: AIQuizResponse;

    try {
      // Try without schema validation first to get raw response
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rawResponse = await this.openRouterService.getChatCompletion<any>({
        model: "google/gemini-2.5-flash-lite",
        // model: "google/gemini-2.5-flash-preview-09-2025",
        systemPrompt: `Jesteś asystentem tworzącym quizy edukacyjne.
Twoim zadaniem jest wygenerowanie quizu na podstawie dostarczonej notatki.

STRUKTURA QUIZU:
- 2 pytania Prawda/Fałsz (true_false)
- 4-5 pytań zamkniętych wielokrotnego wyboru (multiple_choice)
- 1-2 pytania otwarte z krótką odpowiedzią tekstową (short_answer)

WYMAGANIA:
- Wygeneruj tytuł quizu (pole "title") - krótki, opisowy tytuł bazujący na temacie notatki
- Generuj łącznie 7-8 pytań zgodnie ze strukturą powyżej
- Typy pytań: "true_false", "multiple_choice", "short_answer"
- Dla pytań "true_false": podaj opcje ["Prawda", "Fałsz"]
- Dla pytań "multiple_choice": podaj 4 opcje odpowiedzi
- Dla pytań "short_answer": nie podawaj opcji (options może być puste lub pominięte)
- Pytania powinny testować zrozumienie kluczowych konceptów z notatki
- Pytania powinny być konkretne i jednoznaczne
- Poprawna odpowiedź (correct_answer) musi być dokładnie taka jak jedna z opcji

Odpowiadaj TYLKO w formacie JSON zgodnym z dostarczonym schematem:

${JSON.stringify(quizSchema, null, 2)}`,
        userPrompt: `Tytuł notatki: "${note.title}"

Treść notatki:
${note.content}

Wygeneruj quiz testujący zrozumienie tej notatki zgodnie ze strukturą: 2 pytania Prawda/Fałsz, 4-5 pytań wielokrotnego wyboru, 1-2 pytania otwarte.`,
        responseSchema: {
          name: "create_quiz",
          schema: quizSchema,
        },
        temperature: 0.7,
      });

      // eslint-disable-next-line no-console
      console.log("[QuizService] Raw response from AI:", JSON.stringify(rawResponse, null, 2));

      aiQuizResponse = rawResponse as AIQuizResponse;
    } catch (error) {
      if (error instanceof OpenRouterError) {
        // Preserve the original error type so the API layer can map it to proper HTTP codes (e.g., 422 for ModelResponseError)
        throw error;
      }
      throw error;
    }

    // Validate questions array
    if (!aiQuizResponse.questions || !Array.isArray(aiQuizResponse.questions)) {
      throw new Error("AI did not return a valid questions array");
    }

    // Step 3: Transform AI response to application format
    const generateUUID = () => {
      if (typeof crypto !== "undefined" && crypto.randomUUID) {
        return crypto.randomUUID();
      }
      // Fallback UUID generation for environments without crypto.randomUUID
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    };

    const quizId = generateUUID();
    const now = new Date().toISOString();

    // Transform AI response to QuizGenerationResponseDto
    const quiz: QuizGenerationResponseDto = {
      id: quizId,
      note_id: noteId,
      status: "pending_acceptance",
      created_at: now,
      questions: aiQuizResponse.questions.map((q, index) => {
        const questionId = generateUUID();

        // Build answers array based on question type
        let answers;
        if (q.type === "short_answer") {
          // Short answer questions don't have predefined answers
          answers = undefined;
        } else if (q.options && q.options.length > 0) {
          answers = q.options.map((option) => ({
            id: generateUUID(),
            content: option,
            is_correct: option === q.correct_answer,
          }));
        } else {
          answers = undefined;
        }

        return {
          id: questionId,
          type: q.type,
          content: q.question_text,
          question_order: index + 1,
          answers,
          correct_answer: q.correct_answer,
        };
      }),
    };

    // Step 4: Save quiz to database in a transaction
    try {
      // Start transaction by saving quiz first
      const { error: quizError } = await this.supabase.from("quizzes").insert({
        id: quizId,
        note_id: noteId,
        status: "pending_acceptance",
        ai_prompt: `Generated quiz for note: "${note.title}"`,
        ai_raw_response: aiQuizResponse as unknown as Json, // Type assertion for JSONB field
        ai_model_version: "google/gemini-2.5-flash-lite",
        created_at: now,
      });

      if (quizError) {
        throw new Error(`Failed to save quiz: ${quizError.message}`);
      }

      // Save questions
      const questionsToInsert = quiz.questions.map((q) => ({
        id: q.id,
        quiz_id: quizId,
        type: q.type,
        content: q.content,
        question_order: q.question_order,
        correct_answers_data: this.buildCorrectAnswersData(q) as Json, // Type assertion for JSONB field
        created_at: now,
      }));

      const { error: questionsError } = await this.supabase.from("questions").insert(questionsToInsert);

      if (questionsError) {
        throw new Error(`Failed to save questions: ${questionsError.message}`);
      }

      // Save answers for multiple choice questions
      const answersToInsert: {
        id: string;
        question_id: string;
        content: string;
        is_correct: boolean;
        created_at: string;
      }[] = [];

      quiz.questions.forEach((q) => {
        if (q.answers && q.answers.length > 0) {
          q.answers.forEach((answer) => {
            answersToInsert.push({
              id: answer.id,
              question_id: q.id,
              content: answer.content,
              is_correct: answer.is_correct || false,
              created_at: now,
            });
          });
        }
      });

      if (answersToInsert.length > 0) {
        const { error: answersError } = await this.supabase.from("answers").insert(answersToInsert);

        if (answersError) {
          throw new Error(`Failed to save answers: ${answersError.message}`);
        }
      }

      // eslint-disable-next-line no-console
      console.log(`[QuizService] Successfully saved quiz ${quizId} to database`);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("[QuizService] Database save error:", error);
      throw new Error(`Failed to save quiz to database: ${error instanceof Error ? error.message : "Unknown error"}`);
    }

    return quiz;
  }

  /**
   * Builds the correct_answers_data JSONB field for a question.
   * This field stores structured data about correct answers for different question types.
   */
  private buildCorrectAnswersData(question: QuizQuestionDto): Record<string, unknown> {
    switch (question.type) {
      case "true_false": {
        return {
          type: "true_false",
          correct_answer: question.correct_answer === "Prawda" || question.correct_answer === "True",
        };
      }

      case "multiple_choice": {
        // Find the correct answer ID from the answers array
        const correctAnswer = question.answers?.find((answer) => answer.is_correct);
        return {
          type: "multiple_choice",
          correct_answer_id: correctAnswer?.id || null,
          correct_answer_text: question.correct_answer,
        };
      }

      case "short_answer": {
        return {
          type: "short_answer",
          correct_answers: [question.correct_answer],
          // For short answers, we might want to accept variations
          case_sensitive: false,
        };
      }

      default:
        throw new Error(`Unknown question type: ${question.type}`);
    }
  }
}
