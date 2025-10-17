/**
 * Base error class for all OpenRouter-related errors.
 * Extends the native Error class with consistent naming.
 */
export class OpenRouterError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

/**
 * Error thrown when API authentication fails (401).
 * Usually indicates an invalid or missing API key.
 */
export class AuthenticationError extends OpenRouterError {}

/**
 * Error thrown when rate limit is exceeded (429).
 * Indicates too many requests have been made in a given time period.
 */
export class RateLimitError extends OpenRouterError {}

/**
 * Error thrown when the request is malformed or invalid (4xx).
 * Usually indicates incorrect parameters or request structure.
 */
export class InvalidRequestError extends OpenRouterError {}

/**
 * Error thrown when the OpenRouter service is unavailable (5xx).
 * Indicates a temporary server-side issue.
 */
export class ServiceUnavailableError extends OpenRouterError {}

/**
 * Error thrown when the model's response cannot be parsed or validated.
 * Usually indicates the model returned invalid JSON or JSON that doesn't match the schema.
 */
export class ModelResponseError extends OpenRouterError {}
