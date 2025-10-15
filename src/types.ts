/** DTO for a tag associated with a note. */
export interface TagDto {
  id: string;
  name: string;
}

/** DTO for Spaced Repetition System data. */
export interface SrsDataDto {
  due_date: string;
  interval: number;
  ease_factor: number;
}

/** DTO for the detailed view of a single note. */
export interface NoteDetailsDto {
  id: string;
  user_id: string;
  category_id: string | null;
  title: string;
  content: string;
  tags: TagDto[];
  srs_data: SrsDataDto | null;
  created_at: string;
  updated_at: string;
}

/** DTO for a quiz answer. */
export interface QuizAnswerDto {
  id: string;
  content: string;
}

/** Dto for a quiz question. */
export interface QuizQuestionDto {
  id: string;
  type: "true_false" | "multiple_choice" | "short_answer";
  content: string;
  question_order: number;
  answers?: QuizAnswerDto[];
}

/** DTO for the quiz generation API response. */
export interface QuizGenerationResponseDto {
  id: string;
  note_id: string;
  status: "pending_acceptance";
  created_at: string;
  questions: QuizQuestionDto[];
}

/** Represents the state of the quiz generation UI. */
export type QuizGenerationState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "timeout" }
  | { status: "success"; quiz: QuizGenerationResponseDto; isRegenerated?: boolean }
  | { status: "accepting" }
  | { status: "accepted" }
  | { status: "error"; message: string; code?: number };
