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
 * Response structure from OpenRouter API.
 */
interface ApiResponse {
  id: string;
  model: string;
  choices: {
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Service for interacting with OpenRouter API.
 * Handles chat completions with structured JSON responses.
 *
 * @example
 * ```typescript
 * const service = new OpenRouterService();
 * const result = await service.getChatCompletion({
 *   model: 'anthropic/claude-3-haiku',
 *   systemPrompt: 'You are a helpful assistant.',
 *   userPrompt: 'Generate a quiz.',
 *   responseSchema: { name: 'quiz', schema: quizSchema }
 * });
 * ```
 */
export class OpenRouterService {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(config: OpenRouterServiceConfig = {}) {
    this.apiKey = config.apiKey ?? import.meta.env.OPENROUTER_API_KEY;
    this.baseUrl = config.baseUrl ?? "https://openrouter.ai/api/v1";

    if (!this.apiKey) {
      console.error("OpenRouter API key is not configured.");
      throw new Error("OpenRouter API key is not configured. Please set OPENROUTER_API_KEY environment variable.");
    }
  }

  /**
   * Sends a chat completion request to OpenRouter API and returns the parsed response.
   *
   * @template T - The expected type of the response data
   * @param options - Configuration options for the chat completion
   * @returns Promise resolving to the parsed response of type T
   * @throws {AuthenticationError} When API key is invalid (401)
   * @throws {RateLimitError} When rate limit is exceeded (429)
   * @throws {InvalidRequestError} When request is malformed (400)
   * @throws {ServiceUnavailableError} When service is down (5xx)
   * @throws {ModelResponseError} When response parsing/validation fails
   */
  public async getChatCompletion<T>(options: ChatCompletionOptions): Promise<T> {
    const requestBody = this.buildRequestBody(options);
    const apiResponse = await this.executeRequest(requestBody);
    return this.parseResponse<T>(apiResponse, options.responseSchema?.schema);
  }

  /**
   * Builds the request body for OpenRouter API.
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
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": import.meta.env.SITE ?? "http://localhost:4321",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      await this.handleErrorResponse(response);
    }

    return (await response.json()) as ApiResponse;
  }

  /**
   * Handles error responses from the API.
   *
   * @param response - The fetch response object
   * @throws {AuthenticationError} For 401 errors
   * @throws {RateLimitError} For 429 errors
   * @throws {InvalidRequestError} For 400 errors
   * @throws {ServiceUnavailableError} For 5xx errors
   * @throws {OpenRouterError} For other errors
   */
  private async handleErrorResponse(response: Response): Promise<never> {
    const status = response.status;
    let errorMessage: string;

    try {
      const errorData = await response.json();
      errorMessage = errorData.error?.message ?? response.statusText;
    } catch {
      errorMessage = response.statusText;
    }

    switch (status) {
      case 401:
        throw new AuthenticationError(`Authentication failed: ${errorMessage}`);
      case 429:
        throw new RateLimitError(`Rate limit exceeded: ${errorMessage}`);
      case 400:
        throw new InvalidRequestError(`Invalid request: ${errorMessage}`);
      default:
        if (status >= 500) {
          throw new ServiceUnavailableError(`Service unavailable: ${errorMessage}`);
        }
        throw new OpenRouterError(`OpenRouter API error (${status}): ${errorMessage}`);
    }
  }

  /**
   * Parses and validates the API response.
   *
   * @template T - The expected type of the parsed response
   * @param apiResponse - The raw API response
   * @param schema - Optional JSON schema for validation
   * @returns The parsed and validated response
   * @throws {ModelResponseError} When parsing or validation fails
   */
  private parseResponse<T>(apiResponse: ApiResponse, schema?: JSONSchema): T {
    if (!apiResponse.choices || apiResponse.choices.length === 0) {
      throw new ModelResponseError("No choices returned in API response");
    }

    const content = apiResponse.choices[0].message.content;

    if (!content) {
      throw new ModelResponseError("Empty content in API response");
    }

    // If no schema is provided, return content as-is (cast to T)
    if (!schema) {
      return content as T;
    }

    // Parse JSON response
    let parsedData: unknown;
    try {
      parsedData = JSON.parse(content);
    } catch (error) {
      throw new ModelResponseError(
        `Failed to parse JSON response: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }

    // Basic validation against schema
    try {
      this.validateAgainstSchema(parsedData, schema);
    } catch (error) {
      throw new ModelResponseError(
        `Response validation failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }

    return parsedData as T;
  }

  /**
   * Validates data against a JSON schema.
   * Performs basic validation of required fields and types.
   *
   * @param data - The data to validate
   * @param schema - The JSON schema to validate against
   * @throws {Error} When validation fails
   */
  private validateAgainstSchema(data: unknown, schema: JSONSchema): void {
    if (schema.type === "object" && typeof data === "object" && data !== null) {
      const dataObj = data as Record<string, unknown>;

      // Check required fields
      if (schema.required) {
        for (const requiredField of schema.required) {
          if (!(requiredField in dataObj)) {
            throw new Error(`Missing required field: ${requiredField}`);
          }
        }
      }

      // Validate properties
      if (schema.properties) {
        for (const [key, propSchema] of Object.entries(schema.properties)) {
          if (key in dataObj) {
            this.validateFieldType(dataObj[key], propSchema, key);
          }
        }
      }
    } else if (schema.type !== typeof data) {
      throw new Error(`Expected type ${schema.type}, got ${typeof data}`);
    }
  }

  /**
   * Validates a field's type against its schema.
   *
   * @param value - The value to validate
   * @param schema - The schema for this field
   * @param fieldName - The name of the field (for error messages)
   * @throws {Error} When validation fails
   */
  private validateFieldType(value: unknown, schema: JSONSchema, fieldName: string): void {
    const actualType = Array.isArray(value) ? "array" : typeof value;

    if (schema.type === "array") {
      if (!Array.isArray(value)) {
        throw new Error(`Field ${fieldName}: expected array, got ${actualType}`);
      }

      // Validate array items if schema is provided
      if (schema.items && Array.isArray(value)) {
        for (let i = 0; i < value.length; i++) {
          this.validateAgainstSchema(value[i], schema.items);
        }
      }
    } else if (schema.type !== actualType) {
      throw new Error(`Field ${fieldName}: expected ${schema.type}, got ${actualType}`);
    }
  }
}
