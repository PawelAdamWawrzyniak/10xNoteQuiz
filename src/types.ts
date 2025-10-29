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

/** DTO for a note item in a list. */
export interface NoteListItemDto {
  id: string;
  title: string;
  category_id: string | null;
  created_at: string;
  updated_at: string;
}

/** DTO for pagination metadata. */
export interface PaginationDto {
  current_page: number;
  total_pages: number;
  total_items: number;
}

/** Generic DTO for paginated responses. */
export interface PaginatedResponseDto<T> {
  data: T[];
  pagination: PaginationDto;
}

/** DTO for a quiz answer. */
export interface QuizAnswerDto {
  id: string;
  content: string;
  is_correct?: boolean;
}

/** Dto for a quiz question. */
export interface QuizQuestionDto {
  id: string;
  type: "true_false" | "multiple_choice" | "short_answer";
  content: string;
  question_order: number;
  answers?: QuizAnswerDto[];
  correct_answer?: string;
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

/** JSON Schema type for OpenRouter response schemas. */
export interface JSONSchema {
  type: string;
  properties?: Record<string, JSONSchema>;
  required?: string[];
  items?: JSONSchema;
  description?: string;
  enum?: string[];
  [key: string]: unknown;
}

/** Configuration options for OpenRouter chat completion. */
export interface ChatCompletionOptions {
  model: string;
  systemPrompt: string;
  userPrompt: string;
  responseSchema?: {
    name: string;
    schema: JSONSchema;
  };
  temperature?: number;
  maxTokens?: number;
}

/** ViewModel for notes list filters, sorting, and pagination. */
export interface NotesFilterViewModel {
  page: number;
  pageSize: number;
  sortBy: "created_at" | "updated_at" | "title";
  order: "asc" | "desc";
  categoryId?: string;
  tagId?: string;
}

/** ViewModel for note form data. */
export interface NoteFormViewModel {
  title: string;
  content: string;
  categoryId: string | null;
  tags: TagDto[];
}

/** DTO for answering a single question in a quiz. */
export interface UserAnswerDto {
  question_id: string;
  answer: string | null;
}

/** DTO for the result of a single question. */
export interface QuestionResultDto {
  question_id: string;
  user_answer: string | null;
  is_correct: boolean;
  correct_answers_data: {
    correct_answer_id?: string;
    acceptable_answers?: string[];
    correct_value?: boolean;
  };
}

/** DTO for the result of a quiz attempt. */
export interface QuizAttemptResultDto {
  id: string;
  quiz_id: string;
  score_percentage: number;
  completed_at: string;
  results: QuestionResultDto[];
}

/** ViewModel for the state of solving a quiz. */
export interface QuizSolvingState {
  currentQuestionIndex: number;
  userAnswers: Map<string, string | null>;
  isSubmitting: boolean;
  result?: QuizAttemptResultDto;
}

/** DTO for quiz details when solving (with full question data). */
export interface QuizToSolveDto {
  id: string;
  note_id: string;
  note_title: string;
  status: "accepted";
  questions: QuizQuestionDto[];
  created_at: string;
}
