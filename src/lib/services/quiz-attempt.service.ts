import type { SupabaseClient } from "@/db/supabase.client";
import type { QuizToSolveDto, UserAnswerDto, QuizAttemptResultDto, QuestionResultDto } from "@/types";

/**
 * Service for handling quiz attempts and answer validation.
 */
export class QuizAttemptService {
  private supabase: SupabaseClient;
  private userId: string;

  constructor(supabase: SupabaseClient, userId: string) {
    this.supabase = supabase;
    this.userId = userId;
  }

  /**
   * Fetches a quiz for solving, ensuring it's in "accepted" status.
   */
  async getQuizForSolving(quizId: string): Promise<QuizToSolveDto | null> {
    // Fetch quiz with note title
    const { data: quiz, error: quizError } = await this.supabase
      .from("quizzes")
      .select(
        `
        id,
        note_id,
        status,
        created_at,
        notes!inner(title, user_id)
      `
      )
      .eq("id", quizId)
      .eq("status", "accepted")
      .single();

    if (quizError || !quiz) {
      return null;
    }

    // Verify ownership through note
    if (quiz.notes.user_id !== this.userId) {
      return null;
    }

    // Fetch questions with answers
    const { data: questions, error: questionsError } = await this.supabase
      .from("questions")
      .select(
        `
        id,
        type,
        content,
        question_order,
        correct_answers_data,
        answers(id, content, is_correct)
      `
      )
      .eq("quiz_id", quizId)
      .order("question_order", { ascending: true });

    if (questionsError || !questions) {
      throw new Error("Failed to fetch questions");
    }

    // Transform to QuizToSolveDto
    return {
      id: quiz.id,
      note_id: quiz.note_id,
      note_title: quiz.notes.title,
      status: "accepted",
      created_at: quiz.created_at,
      questions: questions.map((q) => ({
        id: q.id,
        type: q.type as "true_false" | "multiple_choice" | "short_answer",
        content: q.content,
        question_order: q.question_order,
        answers: q.answers
          ? q.answers.map((a) => ({
              id: a.id,
              content: a.content,
              is_correct: a.is_correct,
            }))
          : undefined,
        // Don't expose correct answer to frontend during solving
        correct_answer: undefined,
      })),
    };
  }

  /**
   * Submits quiz answers and returns graded results.
   */
  async submitQuizAttempt(quizId: string, answers: UserAnswerDto[]): Promise<QuizAttemptResultDto> {
    // Fetch quiz and verify ownership
    const quiz = await this.getQuizForSolving(quizId);
    if (!quiz) {
      throw new Error("Quiz not found or not accessible");
    }

    // Fetch full question data including correct answers
    const { data: questions, error: questionsError } = await this.supabase
      .from("questions")
      .select(
        `
        id,
        type,
        content,
        correct_answers_data,
        answers(id, content, is_correct)
      `
      )
      .eq("quiz_id", quizId);

    if (questionsError || !questions) {
      throw new Error("Failed to fetch questions for grading");
    }

    // Grade each answer
    const results: QuestionResultDto[] = [];
    let correctCount = 0;

    for (const question of questions) {
      const userAnswer = answers.find((a) => a.question_id === question.id);
      const userAnswerValue = userAnswer?.answer || null;

      let isCorrect = false;
      const correctData = question.correct_answers_data as Record<string, unknown>;

      // Grade based on question type
      switch (question.type) {
        case "true_false": {
          const correctValue = correctData.correct_answer as boolean;
          const userBoolValue =
            userAnswerValue === "true" || userAnswerValue === "Prawda" || userAnswerValue === "True";
          isCorrect = userBoolValue === correctValue;
          break;
        }

        case "multiple_choice": {
          const correctAnswerId = correctData.correct_answer_id as string;
          isCorrect = userAnswerValue === correctAnswerId;
          break;
        }

        case "short_answer": {
          const acceptableAnswers = correctData.correct_answers as string[];
          const caseSensitive = (correctData.case_sensitive as boolean) || false;

          if (userAnswerValue) {
            isCorrect = acceptableAnswers.some((acceptable) => {
              if (caseSensitive) {
                return userAnswerValue.trim() === acceptable.trim();
              }
              return userAnswerValue.trim().toLowerCase() === acceptable.trim().toLowerCase();
            });
          }
          break;
        }
      }

      if (isCorrect) {
        correctCount++;
      }

      results.push({
        question_id: question.id,
        user_answer: userAnswerValue,
        is_correct: isCorrect,
        correct_answers_data: {
          correct_answer_id:
            question.type === "multiple_choice" ? (correctData.correct_answer_id as string) : undefined,
          acceptable_answers: question.type === "short_answer" ? (correctData.correct_answers as string[]) : undefined,
          correct_value: question.type === "true_false" ? (correctData.correct_answer as boolean) : undefined,
        },
      });
    }

    // Calculate score
    const scorePercentage = Math.round((correctCount / questions.length) * 100);

    // Generate UUID for attempt
    const generateUUID = () => {
      if (typeof crypto !== "undefined" && crypto.randomUUID) {
        return crypto.randomUUID();
      }
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    };

    const attemptId = generateUUID();
    const completedAt = new Date().toISOString();

    // Save attempt to database
    const { error: attemptError } = await this.supabase.from("quiz_attempts").insert({
      id: attemptId,
      quiz_id: quizId,
      user_id: this.userId,
      score_percentage: scorePercentage,
      completed_at: completedAt,
      user_answers: answers,
    });

    if (attemptError) {
      throw new Error(`Failed to save quiz attempt: ${attemptError.message}`);
    }

    return {
      id: attemptId,
      quiz_id: quizId,
      score_percentage: scorePercentage,
      completed_at: completedAt,
      results,
    };
  }
}
