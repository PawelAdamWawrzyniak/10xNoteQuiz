import type { SupabaseClient } from "@/db/supabase.client";
import type { QuizGenerationResponseDto } from "@/types";
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
        model: "anthropic/claude-3.5-haiku",
        systemPrompt: `Jesteś asystentem tworzącym quizy edukacyjne. 
Twoim zadaniem jest wygenerowanie quizu składającego się z 3 pytań na podstawie dostarczonej notatki.

WYMAGANIA:
- Wygeneruj tytuł quizu (pole "title") - krótki, opisowy tytuł bazujący na temacie notatki
- Generuj dokładnie 3 pytania różnego typu
- Typy pytań: "true_false", "multiple_choice", "short_answer"
- Dla pytań "true_false": podaj opcje ["Prawda", "Fałsz"]
- Dla pytań "multiple_choice": podaj 4 opcje odpowiedzi
- Dla pytań "short_answer": nie podawaj opcji (options może być puste lub pominięte)
- Pytania powinny testować zrozumienie kluczowych konceptów z notatki
- Pytania powinny być konkretne i jednoznaczne
- Poprawna odpowiedź (correct_answer) musi być dokładnie taka jak jedna z opcji

Odpowiadaj TYLKO w formacie JSON zgodnym z dostarczonym schematem.`,
        userPrompt: `Tytuł notatki: "${note.title}"

Treść notatki:
${note.content}

Wygeneruj quiz z 3 pytaniami testującymi zrozumienie tej notatki.`,
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

    // In a real implementation, you would:
    // 1. Save the quiz to the 'quizzes' table
    // 2. Save each question to the 'quiz_questions' table
    // 3. Save each answer to the 'quiz_answers' table
    // All wrapped in a database transaction

    return quiz;
  }
}
