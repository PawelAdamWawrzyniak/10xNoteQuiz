# OpenRouter Service - Przykłady Użycia

## 1. Podstawowe Wywołanie (String Response)

```typescript
import { OpenRouterService } from "@/lib/services/openrouter.service";

const service = new OpenRouterService();

const explanation = await service.getChatCompletion<string>({
  model: "anthropic/claude-3.5-haiku",
  systemPrompt: "You are a helpful programming tutor.",
  userPrompt: "Explain what TypeScript is in one sentence.",
});

console.log(explanation);
// Output: "TypeScript is a statically-typed superset of JavaScript..."
```

## 2. Strukturyzowana Odpowiedź JSON

```typescript
import { OpenRouterService } from "@/lib/services/openrouter.service";

interface SummaryResponse {
  title: string;
  key_points: string[];
  conclusion: string;
}

const summarySchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    key_points: { 
      type: "array",
      items: { type: "string" }
    },
    conclusion: { type: "string" }
  },
  required: ["title", "key_points", "conclusion"]
} as const;

const service = new OpenRouterService();

const summary = await service.getChatCompletion<SummaryResponse>({
  model: "anthropic/claude-3.5-haiku",
  systemPrompt: "You are a text summarization assistant. Always respond in JSON format.",
  userPrompt: `Summarize this article: ${articleContent}`,
  responseSchema: {
    name: "create_summary",
    schema: summarySchema
  },
  temperature: 0.5
});

console.log(summary.title);
console.log(summary.key_points);
```

## 3. Generowanie Quizu (Production Use Case)

```typescript
import { OpenRouterService } from "@/lib/services/openrouter.service";
import { quizSchema } from "@/pages/api/notes/[noteId]/_schema";

interface Quiz {
  title: string;
  questions: Array<{
    type: "true_false" | "multiple_choice" | "short_answer";
    question_text: string;
    options?: string[];
    correct_answer: string;
  }>;
}

const service = new OpenRouterService();

const quiz = await service.getChatCompletion<Quiz>({
  model: "anthropic/claude-3.5-haiku",
  systemPrompt: `Jesteś asystentem tworzącym quizy edukacyjne.
Generuj dokładnie 3 pytania różnego typu.
Odpowiadaj TYLKO w formacie JSON.`,
  userPrompt: `Wygeneruj quiz na podstawie tej notatki: ${noteContent}`,
  responseSchema: {
    name: "create_quiz",
    schema: quizSchema
  },
  temperature: 0.7
});

console.log(`Created quiz: ${quiz.title}`);
console.log(`Questions: ${quiz.questions.length}`);
```

## 4. Obsługa Błędów

```typescript
import { OpenRouterService } from "@/lib/services/openrouter.service";
import {
  AuthenticationError,
  RateLimitError,
  ServiceUnavailableError,
  ModelResponseError,
  OpenRouterError
} from "@/lib/services/openrouter.errors";

const service = new OpenRouterService();

try {
  const result = await service.getChatCompletion<string>({
    model: "anthropic/claude-3.5-haiku",
    systemPrompt: "You are a helpful assistant.",
    userPrompt: "Hello!",
  });
  
  console.log(result);
  
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error("Invalid API key. Please check your configuration.");
    // Notify admin, log to monitoring service
    
  } else if (error instanceof RateLimitError) {
    console.error("Rate limit exceeded. Retrying in 60 seconds...");
    // Implement retry logic with exponential backoff
    
  } else if (error instanceof ServiceUnavailableError) {
    console.error("OpenRouter is temporarily unavailable.");
    // Show user-friendly error, try fallback service
    
  } else if (error instanceof ModelResponseError) {
    console.error("AI returned invalid JSON. Requesting regeneration...");
    // Retry with same or different prompt
    
  } else if (error instanceof OpenRouterError) {
    console.error(`OpenRouter error: ${error.message}`);
    // Log and report
    
  } else {
    console.error("Unexpected error:", error);
    // Generic error handling
  }
}
```

## 5. Custom Configuration (Testing)

```typescript
import { OpenRouterService } from "@/lib/services/openrouter.service";

// Use custom API key and base URL (useful for testing)
const service = new OpenRouterService({
  apiKey: "test-api-key",
  baseUrl: "http://localhost:3001/mock-api"
});

const result = await service.getChatCompletion<string>({
  model: "anthropic/claude-3.5-haiku",
  systemPrompt: "Test prompt",
  userPrompt: "Test message",
});
```

## 6. Różne Temperatury dla Różnych Zastosowań

```typescript
import { OpenRouterService } from "@/lib/services/openrouter.service";

const service = new OpenRouterService();

// Niska temperatura (0.0-0.3) - deterministic, factual responses
const factual = await service.getChatCompletion<string>({
  model: "anthropic/claude-3.5-haiku",
  systemPrompt: "Provide factual information.",
  userPrompt: "What is 2+2?",
  temperature: 0.1  // Very deterministic
});

// Średnia temperatura (0.5-0.7) - balanced creativity
const balanced = await service.getChatCompletion<string>({
  model: "anthropic/claude-3.5-haiku",
  systemPrompt: "Generate quiz questions.",
  userPrompt: "Create questions about JavaScript.",
  temperature: 0.7  // Good for quiz generation
});

// Wysoka temperatura (0.8-1.0) - creative, varied responses
const creative = await service.getChatCompletion<string>({
  model: "anthropic/claude-3.5-haiku",
  systemPrompt: "Write a creative story.",
  userPrompt: "Write a short story about a developer.",
  temperature: 0.9  // Very creative
});
```

## 7. Limit Tokenów

```typescript
import { OpenRouterService } from "@/lib/services/openrouter.service";

const service = new OpenRouterService();

// Krótka odpowiedź (oszczędność kosztów)
const brief = await service.getChatCompletion<string>({
  model: "anthropic/claude-3.5-haiku",
  systemPrompt: "Be brief.",
  userPrompt: "Explain async/await.",
  maxTokens: 100  // Limit to ~75 words
});

// Długa odpowiedź (szczegółowa analiza)
const detailed = await service.getChatCompletion<string>({
  model: "anthropic/claude-3.5-haiku",
  systemPrompt: "Provide detailed explanation.",
  userPrompt: "Explain async/await with examples.",
  maxTokens: 1000  // Allow up to ~750 words
});
```

## 8. Walidacja Odpowiedzi w Aplikacji

```typescript
import { OpenRouterService } from "@/lib/services/openrouter.service";
import { ModelResponseError } from "@/lib/services/openrouter.errors";

const service = new OpenRouterService();

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

const validationSchema = {
  type: "object",
  properties: {
    isValid: { type: "boolean" },
    errors: {
      type: "array",
      items: { type: "string" }
    }
  },
  required: ["isValid", "errors"]
} as const;

try {
  const result = await service.getChatCompletion<ValidationResult>({
    model: "anthropic/claude-3.5-haiku",
    systemPrompt: "Validate the code and return validation results in JSON.",
    userPrompt: `Validate this code: ${userCode}`,
    responseSchema: {
      name: "validate_code",
      schema: validationSchema
    }
  });
  
  if (!result.isValid) {
    console.log("Validation errors:", result.errors);
  }
  
} catch (error) {
  if (error instanceof ModelResponseError) {
    console.error("AI failed to return valid validation result");
  }
}
```

## 9. Różne Modele dla Różnych Zadań

```typescript
import { OpenRouterService } from "@/lib/services/openrouter.service";

const service = new OpenRouterService();

// Fast and cheap - dla prostych zadań
const quick = await service.getChatCompletion<string>({
  model: "anthropic/claude-3.5-haiku",  // Fastest, cheapest
  systemPrompt: "Summarize briefly.",
  userPrompt: text,
});

// Balanced - dla większości przypadków
const balanced = await service.getChatCompletion<string>({
  model: "anthropic/claude-3.5-sonnet",  // Good balance
  systemPrompt: "Analyze this text.",
  userPrompt: text,
});

// High quality - dla skomplikowanych zadań
const premium = await service.getChatCompletion<string>({
  model: "openai/gpt-4o",  // Highest quality
  systemPrompt: "Provide deep analysis.",
  userPrompt: text,
});
```

## 10. Retry Logic z Exponential Backoff

```typescript
import { OpenRouterService } from "@/lib/services/openrouter.service";
import { RateLimitError } from "@/lib/services/openrouter.errors";

const service = new OpenRouterService();

async function getChatCompletionWithRetry<T>(
  options: any,
  maxRetries = 3
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await service.getChatCompletion<T>(options);
      
    } catch (error) {
      lastError = error as Error;
      
      if (error instanceof RateLimitError && attempt < maxRetries - 1) {
        const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
        console.log(`Rate limited. Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      throw error;
    }
  }
  
  throw lastError!;
}

// Usage
const result = await getChatCompletionWithRetry<string>({
  model: "anthropic/claude-3.5-haiku",
  systemPrompt: "You are helpful.",
  userPrompt: "Hello!",
});
```

## Wskazówki Best Practices

1. **Zawsze używaj `responseSchema`** dla strukturyzowanych danych
2. **Ustaw odpowiednią `temperature`** dla danego zadania
3. **Ogranicz `maxTokens`** aby kontrolować koszty
4. **Implementuj retry logic** dla `RateLimitError`
5. **Loguj błędy** dla monitoringu i debugowania
6. **Waliduj dane wejściowe** przed wysłaniem do API
7. **Cachuj odpowiedzi** gdy to możliwe
8. **Monitoruj koszty** używając dashboardu OpenRouter
9. **Testuj różne modele** aby znaleźć najlepszy stosunek jakości do ceny
10. **Używaj type safety** - zawsze definiuj typy TypeScript dla odpowiedzi

