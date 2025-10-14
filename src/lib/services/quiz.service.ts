import type { SupabaseClient } from "@/db/supabase.client";
import type { QuizGenerationResponseDto } from "@/types";

export class QuizGenerationService {
  private supabase: SupabaseClient;
  private userId: string;

  constructor(supabase: SupabaseClient, userId: string) {
    this.supabase = supabase;
    this.userId = userId;
  }

  public async generateQuizForNote(noteId: string): Promise<QuizGenerationResponseDto> {
    // const { data: note, error: noteError } = await this.supabase
    //   .from("notes")
    //   .select("content")
    //   .eq("user_id", this.userId)
    //   .single();

    // Mock note data for testing
    const note = {
      content:
        "This is a sample note content that is long enough to generate a quiz. It contains information about various topics that can be used to create meaningful questions. The content should be at least 100 characters long to pass validation.",
    };

    const noteError = null;
    if (noteError || !note) {
      throw new Error("Note not found or access denied.");
    }

    if (note.content.length < 100) {
      throw new Error("Note content is too short to generate a quiz.");
    }

    // Step 2: (Mocked) AI interaction
    // In a real implementation, you would call an external AI service here.
    // const apiKey = process.env.OPENROUTER_API_KEY;
    // const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    //   method: "POST",
    //   headers: {
    //     "Authorization": `Bearer ${apiKey}`,
    //     "Content-Type": "application/json"
    //   },
    //   body: JSON.stringify({
    //     "model": "openai/gpt-3.5-turbo",
    //     "messages": [
    //       { "role": "user", "content": `Generate a quiz from the following text: ${note.content}` }
    //     ]
    //   })
    // });
    // const aiData = await response.json();

    // Step 3: Generate quiz data based on note content
    // In a real implementation, AI would generate questions from the note content
    // For now, we return mock data with realistic quiz structure
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

    // Generate a mock quiz with various question types
    // This simulates what an AI would generate from the note content
    const mockQuiz: QuizGenerationResponseDto = {
      id: quizId,
      note_id: noteId,
      status: "pending_acceptance",
      created_at: now,
      questions: [
        {
          id: generateUUID(),
          type: "multiple_choice",
          content: "What is the main topic discussed in this note?",
          question_order: 1,
          answers: [
            { id: generateUUID(), content: "Introduction to the subject" },
            { id: generateUUID(), content: "Advanced concepts" },
            { id: generateUUID(), content: "Practical applications" },
            { id: generateUUID(), content: "Historical context" },
          ],
        },
        {
          id: generateUUID(),
          type: "true_false",
          content: "The note content provides detailed explanations?",
          question_order: 2,
          answers: [
            { id: generateUUID(), content: "True" },
            { id: generateUUID(), content: "False" },
          ],
        },
        {
          id: generateUUID(),
          type: "short_answer",
          content: "Summarize the key points from this note in your own words.",
          question_order: 3,
          // Short answer questions don't have predefined answers
        },
      ],
    };

    // In a real implementation, you would:
    // 1. Save the quiz to the 'quizzes' table
    // 2. Save each question to the 'quiz_questions' table
    // 3. Save each answer to the 'quiz_answers' table
    // All wrapped in a database transaction
    console.log("Mock quiz generated for note:", noteId);

    return mockQuiz;
  }
}
