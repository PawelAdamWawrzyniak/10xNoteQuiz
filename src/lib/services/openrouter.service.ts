import type { ChatCompletionOptions, JSONSchema } from "@/types";
import {
  AuthenticationError,
  InvalidRequestError,
  ModelResponseError,
  OpenRouterError,
  RateLimitError,
  ServiceUnavailableError,
} from "./openrouter.errors";

/**
 * Configuration options for OpenRouterService.
 */
interface OpenRouterServiceConfig {
  apiKey?: string;
  baseUrl?: string;
}

/**
 * Structure of the API response from OpenRouter.
 */
interface ApiResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Service for interacting with OpenRouter API.
 * Handles communication with LLM models and processes structured JSON responses.
 *
 * @example
 * ```typescript
 * const service = new OpenRouterService();
 * const result = await service.getChatCompletion<Quiz>({
 *   model: 'anthropic/claude-3-haiku',
 *   systemPrompt: 'You are a quiz creator.',
 *   userPrompt: 'Create a quiz about JavaScript.',
 *   responseSchema: { name: 'create_quiz', schema: quizSchema }
 * });
 * ```
 */
export class OpenRouterService {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  /**
   * Creates a new OpenRouterService instance.
   *
   * @param config - Optional configuration object
   * @throws {Error} When API key is not configured
   */
  constructor(config: OpenRouterServiceConfig = {}) {
    this.apiKey = config.apiKey ?? import.meta.env.OPENROUTER_API_KEY;
    this.baseUrl = config.baseUrl ?? "https://openrouter.ai/api/v1";

    if (!this.apiKey) {
      throw new Error("OpenRouter API key is not configured. Please set OPENROUTER_API_KEY environment variable.");
    }
  }

  /**
   * Sends a chat completion request to OpenRouter and returns the parsed response.
   *
   * @template T - The expected type of the response
   * @param options - Chat completion options including model, prompts, and optional schema
   * @returns Promise resolving to the parsed response of type T
   * @throws {AuthenticationError} When API key is invalid (401)
   * @throws {RateLimitError} When rate limit is exceeded (429)
   * @throws {InvalidRequestError} When request is malformed (4xx)
   * @throws {ServiceUnavailableError} When service is unavailable (5xx)
   * @throws {ModelResponseError} When response cannot be parsed or validated
   */
  public async getChatCompletion<T>(options: ChatCompletionOptions): Promise<T> {
    const requestBody = this.buildRequestBody(options);
    const apiResponse = await this.executeRequest(requestBody);
    return this.parseResponse<T>(apiResponse, options.responseSchema?.schema);
  }

  /**
   * Builds the request body for the OpenRouter API.
   *
   * @param options - Chat completion options
   * @returns Request body object
   */
  private buildRequestBody(options: ChatCompletionOptions): Record<string, unknown> {
    const body: Record<string, unknown> = {
      model: options.model,
      messages: [
        { role: "system", content: options.systemPrompt },
        { role: "user", content: options.userPrompt },
      ],
    };

    if (options.responseSchema) {
      body.response_format = {
        type: "json_schema",
        json_schema: {
          name: options.responseSchema.name,
          strict: true,
          schema: options.responseSchema.schema,
        },
      };
    }

    if (options.temperature !== undefined) {
      body.temperature = options.temperature;
    }
    if (options.maxTokens !== undefined) {
      body.max_tokens = options.maxTokens;
    }

    return body;
  }

  /**
   * Executes the HTTP request to OpenRouter API.
   *
   * @param requestBody - The request body to send
   * @returns Promise resolving to the API response
   * @throws {AuthenticationError} When authentication fails
   * @throws {RateLimitError} When rate limit is exceeded
   * @throws {InvalidRequestError} When request is invalid
   * @throws {ServiceUnavailableError} When service is unavailable
   */
  private async executeRequest(requestBody: Record<string, unknown>): Promise<ApiResponse> {
    const url = `${this.baseUrl}/chat/completions`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": import.meta.env.SITE ?? "http://localhost:4321",
          "X-Title": "10xDevs Quiz Generator",
        },
        body: JSON.stringify(requestBody),
      });

      // Handle HTTP errors
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage: string;

        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.error?.message || errorText;
        } catch {
          errorMessage = errorText;
        }

        switch (response.status) {
          case 401:
            throw new AuthenticationError(`Authentication failed: ${errorMessage}`);
          case 429:
            throw new RateLimitError(`Rate limit exceeded: ${errorMessage}`);
          case 400:
          case 403:
          case 404:
            throw new InvalidRequestError(`Invalid request (${response.status}): ${errorMessage}`);
          case 500:
          case 502:
          case 503:
          case 504:
            throw new ServiceUnavailableError(`Service unavailable (${response.status}): ${errorMessage}`);
          default:
            throw new OpenRouterError(`Request failed (${response.status}): ${errorMessage}`);
        }
      }

      const data = await response.json();
      return data as ApiResponse;
    } catch (error) {
      // Re-throw known errors
      if (error instanceof OpenRouterError) {
        throw error;
      }

      // Wrap network and other errors
      throw new OpenRouterError(
        `Failed to communicate with OpenRouter API: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Parses and validates the API response.
   *
   * @template T - The expected type of the response
   * @param apiResponse - The raw API response
   * @param schema - Optional JSON schema for validation
   * @returns Parsed response of type T
   * @throws {ModelResponseError} When response is invalid or doesn't match schema
   */
  private parseResponse<T>(apiResponse: ApiResponse, schema?: JSONSchema): T {
    // Validate response structure
    if (!apiResponse.choices || apiResponse.choices.length === 0) {
      throw new ModelResponseError("Invalid API response: no choices returned");
    }

    const content = apiResponse.choices[0]?.message?.content;

    if (!content) {
      throw new ModelResponseError("Invalid API response: empty content");
    }

    // If no schema provided, return content as-is (for string responses)
    if (!schema) {
      return content as T;
    }

    // Parse JSON response
    try {
      const parsed = JSON.parse(content);

      // Basic schema validation
      this.validateAgainstSchema(parsed, schema);

      return parsed as T;
    } catch (error) {
      if (error instanceof ModelResponseError) {
        throw error;
      }

      throw new ModelResponseError(
        `Failed to parse model response as JSON: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Validates parsed JSON against a schema.
   * Performs basic validation of required fields and types.
   *
   * @param data - The parsed JSON data
   * @param schema - The JSON schema to validate against
   * @throws {ModelResponseError} When validation fails
   */
  private validateAgainstSchema(data: unknown, schema: JSONSchema): void {
    // Type guard to ensure data is an object
    if (typeof data !== "object" || data === null) {
      throw new ModelResponseError(`Model response has incorrect type: expected object, got ${typeof data}`);
    }

    // Check required fields at root level
    if (schema.required && Array.isArray(schema.required)) {
      for (const field of schema.required) {
        if (!(field in data)) {
          throw new ModelResponseError(`Model response missing required field: ${field}`);
        }
      }
    }

    // Check type at root level
    if (schema.type === "object" && typeof data !== "object") {
      throw new ModelResponseError(`Model response has incorrect type: expected object, got ${typeof data}`);
    }

    if (schema.type === "array" && !Array.isArray(data)) {
      throw new ModelResponseError(`Model response has incorrect type: expected array, got ${typeof data}`);
    }

    // Note: This is a basic validation. For production, consider using a library like ajv
    // for complete JSON Schema validation if more complex schemas are needed.
  }
}
