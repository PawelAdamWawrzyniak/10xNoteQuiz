/**
 * Base error class for all OpenRouter service errors.
 */
export class OpenRouterError extends Error {
  public debug?: unknown;
  public statusCode?: number;

  constructor(message: string, debug?: unknown, statusCode?: number) {
    super(message);
    this.name = this.constructor.name;
    this.debug = debug;
    this.statusCode = statusCode;
  }
}

/**
 * Error thrown when authentication with OpenRouter API fails.
 * Typically occurs with invalid or missing API key (HTTP 401).
 */
export class AuthenticationError extends OpenRouterError {}

/**
 * Error thrown when rate limit is exceeded.
 * Occurs when too many requests are made in a short time (HTTP 429).
 */
export class RateLimitError extends OpenRouterError {}

/**
 * Error thrown when the request is invalid.
 * Occurs with malformed requests or invalid parameters (HTTP 400).
 */
export class InvalidRequestError extends OpenRouterError {}

/**
 * Error thrown when the OpenRouter service is unavailable.
 * Occurs with server errors (HTTP 5xx).
 */
export class ServiceUnavailableError extends OpenRouterError {}

/**
 * Error thrown when the model's response cannot be parsed or validated.
 * Occurs when the model returns invalid JSON or data that doesn't match the schema.
 */
export class ModelResponseError extends OpenRouterError {}
