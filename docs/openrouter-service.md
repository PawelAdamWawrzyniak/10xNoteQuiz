# OpenRouter Service Documentation

## Overview

`OpenRouterService` is a service class that encapsulates all interactions with the OpenRouter API. It provides a clean, type-safe interface for making chat completion requests with support for structured JSON responses.

## Features

- ✅ Type-safe API with TypeScript generics
- ✅ Structured JSON response with schema validation
- ✅ Comprehensive error handling with custom error types
- ✅ Support for multiple AI models via OpenRouter
- ✅ Configurable temperature and max tokens
- ✅ Built-in JSON schema validation
- ✅ Server-side only (secure API key management)

## Installation & Configuration

### 1. Environment Variables

Add your OpenRouter API key to the `.env` file:

```env
OPENROUTER_API_KEY=sk-or-v1-your_api_key_here
SITE=http://localhost:4321  # Optional: for HTTP-Referer header
```

### 2. Type Definitions

The service uses types defined in `src/types.ts`:

```typescript
interface ChatCompletionOptions {
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
```

## Usage

### Basic Usage (Text Response)

```typescript
import { OpenRouterService } from "@/lib/services/openrouter.service";

const service = new OpenRouterService();

const response = await service.getChatCompletion<string>({
  model: "anthropic/claude-3.5-haiku",
  systemPrompt: "You are a helpful assistant.",
  userPrompt: "What is the capital of France?",
  temperature: 0.7,
});

console.log(response); // "Paris is the capital of France."
```

### Structured JSON Response

```typescript
import { OpenRouterService } from "@/lib/services/openrouter.service";
import type { JSONSchema } from "@/types";

interface Quiz {
  title: string;
  questions: Array<{
    type: "true_false" | "multiple_choice" | "short_answer";
    question_text: string;
    options?: string[];
    correct_answer: string;
  }>;
}

const quizSchema: JSONSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    questions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          type: { type: "string", enum: ["true_false", "multiple_choice", "short_answer"] },
          question_text: { type: "string" },
          options: { type: "array", items: { type: "string" } },
          correct_answer: { type: "string" },
        },
        required: ["type", "question_text", "correct_answer"],
      },
    },
  },
  required: ["title", "questions"],
};

const service = new OpenRouterService();

const quiz = await service.getChatCompletion<Quiz>({
  model: "anthropic/claude-3.5-haiku",
  systemPrompt: "You are a quiz generator. Always respond in JSON format.",
  userPrompt: "Generate a quiz about JavaScript closures.",
  responseSchema: {
    name: "create_quiz",
    schema: quizSchema,
  },
  temperature: 0.7,
});

console.log(quiz.title);
console.log(quiz.questions);
```

### Error Handling

```typescript
import { OpenRouterService } from "@/lib/services/openrouter.service";
import {
  OpenRouterError,
  AuthenticationError,
  RateLimitError,
  ServiceUnavailableError,
  ModelResponseError,
} from "@/lib/services/openrouter.errors";

const service = new OpenRouterService();

try {
  const response = await service.getChatCompletion<string>({
    model: "anthropic/claude-3.5-haiku",
    systemPrompt: "You are a helpful assistant.",
    userPrompt: "Hello!",
  });

  console.log(response);
} catch (error) {
  if (error instanceof AuthenticationError) {
    // Handle authentication errors (401)
    console.error("Invalid API key");
  } else if (error instanceof RateLimitError) {
    // Handle rate limit errors (429)
    console.error("Too many requests, try again later");
  } else if (error instanceof ServiceUnavailableError) {
    // Handle service errors (5xx)
    console.error("Service temporarily unavailable");
  } else if (error instanceof ModelResponseError) {
    // Handle invalid model responses
    console.error("Model returned invalid data");
  } else if (error instanceof OpenRouterError) {
    // Handle other OpenRouter errors
    console.error(`OpenRouter error: ${error.message}`);
  } else {
    // Handle unexpected errors
    console.error("Unexpected error:", error);
  }
}
```

## API Reference

### Constructor

```typescript
constructor(config?: OpenRouterServiceConfig)
```

Creates a new instance of OpenRouterService.

**Parameters:**

- `config` (optional): Configuration object
  - `apiKey` (string): Override the API key from environment variables
  - `baseUrl` (string): Override the base URL (default: `https://openrouter.ai/api/v1`)

**Throws:**

- `Error`: If API key is not configured

### getChatCompletion<T>()

```typescript
public async getChatCompletion<T>(options: ChatCompletionOptions): Promise<T>
```

Sends a chat completion request and returns the parsed response.

**Type Parameters:**

- `T`: The expected type of the response

**Parameters:**

- `options`: Chat completion options
  - `model` (string): Model identifier (e.g., `"anthropic/claude-3.5-haiku"`)
  - `systemPrompt` (string): System message to set context
  - `userPrompt` (string): User message/query
  - `responseSchema` (optional): Schema for structured JSON response
    - `name` (string): Schema name
    - `schema` (JSONSchema): JSON schema definition
  - `temperature` (optional, number): Sampling temperature (0.0-1.0)
  - `maxTokens` (optional, number): Maximum tokens in response

**Returns:**

- `Promise<T>`: Parsed response of type T

**Throws:**

- `AuthenticationError`: Invalid API key (401)
- `RateLimitError`: Rate limit exceeded (429)
- `InvalidRequestError`: Malformed request (400)
- `ServiceUnavailableError`: Service down (5xx)
- `ModelResponseError`: Invalid response format

## Error Types

### OpenRouterError

Base error class for all OpenRouter-related errors.

### AuthenticationError

Thrown when API authentication fails (HTTP 401). Usually indicates an invalid or missing API key.

### RateLimitError

Thrown when rate limit is exceeded (HTTP 429). Indicates too many requests in a short time.

### InvalidRequestError

Thrown when the request is malformed (HTTP 400). Check request parameters.

### ServiceUnavailableError

Thrown when the service is unavailable (HTTP 5xx). Usually temporary.

### ModelResponseError

Thrown when the model's response cannot be parsed or validated against the schema.

## Available Models

OpenRouter provides access to many models. Common choices:

- `anthropic/claude-3.5-haiku` - Fast, cost-effective
- `anthropic/claude-3.5-sonnet` - Balanced performance
- `anthropic/claude-3-opus` - Most capable
- `openai/gpt-4-turbo` - OpenAI's latest
- `openai/gpt-3.5-turbo` - Fast and cheap

See [OpenRouter Models](https://openrouter.ai/models) for the full list.

## Best Practices

### 1. Temperature Control

- **Low (0.0-0.3)**: For factual, deterministic responses
- **Medium (0.4-0.7)**: For balanced creativity and accuracy
- **High (0.8-1.0)**: For creative, varied responses

### 2. Prompt Engineering

```typescript
// Good: Clear, specific instructions
systemPrompt: "You are a quiz generator. Generate exactly 3 questions. Always respond in JSON format matching the provided schema.";

// Bad: Vague instructions
systemPrompt: "Make a quiz.";
```

### 3. Schema Design

```typescript
// Good: Clear, specific schema with descriptions
const schema: JSONSchema = {
  type: "object",
  properties: {
    title: {
      type: "string",
      description: "A concise title for the quiz",
    },
    questions: {
      type: "array",
      description: "List of quiz questions",
      items: {
        /* ... */
      },
    },
  },
  required: ["title", "questions"],
};
```

### 4. Error Handling

Always wrap API calls in try-catch blocks and handle specific error types:

```typescript
try {
  const result = await service.getChatCompletion({
    /* ... */
  });
  // Handle success
} catch (error) {
  if (error instanceof RateLimitError) {
    // Implement retry logic with exponential backoff
  } else if (error instanceof ModelResponseError) {
    // Log for debugging, show user-friendly message
  }
  // Handle other errors...
}
```

### 5. Security

- ⚠️ **Never** expose API keys to the client
- ✅ Always use the service in server-side code (Astro API routes)
- ✅ Store API keys in environment variables
- ✅ Add `.env` to `.gitignore`

## Integration Example

See `src/lib/services/quiz.service.ts` for a complete integration example where `OpenRouterService` is used to generate quizzes from notes.

## Testing

For testing, you can inject a custom configuration:

```typescript
const mockService = new OpenRouterService({
  apiKey: "test-key",
  baseUrl: "http://localhost:3000/mock-api",
});
```

## Troubleshooting

### "OpenRouter API key is not configured"

- Ensure `OPENROUTER_API_KEY` is set in `.env`
- Restart the development server after adding environment variables

### "Authentication failed"

- Verify your API key is correct
- Check that the key hasn't expired
- Ensure the key has sufficient credits

### "Rate limit exceeded"

- Implement exponential backoff retry logic
- Consider upgrading your OpenRouter plan
- Cache responses when possible

### "Model returned invalid response"

- Check your schema definition
- Verify the model supports structured outputs
- Review the system prompt for clarity

## Related Files

- `src/lib/services/openrouter.service.ts` - Service implementation
- `src/lib/services/openrouter.errors.ts` - Error definitions
- `src/lib/services/openrouter.service.example.ts` - Usage examples
- `src/lib/services/quiz.service.ts` - Integration example
- `src/types.ts` - Type definitions
- `.ai/openrouter-service-implementation-plan.md` - Implementation plan
