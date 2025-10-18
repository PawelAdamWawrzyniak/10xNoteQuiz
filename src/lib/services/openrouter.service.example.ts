/* eslint-disable no-console */
/**
 * EXAMPLE FILE - Usage examples for OpenRouterService
 * This file demonstrates how to use OpenRouterService in different scenarios.
 * DO NOT import this file in production code.
 */

import { OpenRouterService } from "./openrouter.service";
import type { JSONSchema } from "@/types";

// ============================================================================
// Example 1: Simple text completion (no structured response)
// ============================================================================

export async function exampleSimpleCompletion() {
  const service = new OpenRouterService();

  const response = await service.getChatCompletion<string>({
    model: "anthropic/claude-3.5-haiku",
    systemPrompt: "You are a helpful assistant.",
    userPrompt: "What is the capital of France?",
    temperature: 0.7,
  });

  console.log(response); // "Paris is the capital of France."
}

// ============================================================================
// Example 2: Structured JSON response with schema
// ============================================================================

interface SummaryResponse {
  title: string;
  summary: string;
  keyPoints: string[];
}

const summarySchema: JSONSchema = {
  type: "object",
  properties: {
    title: { type: "string", description: "A concise title for the content" },
    summary: { type: "string", description: "A brief summary of the content" },
    keyPoints: {
      type: "array",
      description: "List of key points",
      items: { type: "string" },
    },
  },
  required: ["title", "summary", "keyPoints"],
};

export async function exampleStructuredResponse(content: string) {
  const service = new OpenRouterService();

  const response = await service.getChatCompletion<SummaryResponse>({
    model: "anthropic/claude-3.5-haiku",
    systemPrompt: "You are an assistant that creates summaries. Always respond in JSON format.",
    userPrompt: `Summarize the following content:\n\n${content}`,
    responseSchema: {
      name: "create_summary",
      schema: summarySchema,
    },
    temperature: 0.5,
  });

  console.log(response.title);
  console.log(response.summary);
  console.log(response.keyPoints);
}

// ============================================================================
// Example 3: Error handling
// ============================================================================

import {
  OpenRouterError,
  AuthenticationError,
  RateLimitError,
  ServiceUnavailableError,
  ModelResponseError,
} from "./openrouter.errors";

export async function exampleErrorHandling() {
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
      console.error("Authentication failed. Check your API key.");
    } else if (error instanceof RateLimitError) {
      console.error("Rate limit exceeded. Please try again later.");
    } else if (error instanceof ServiceUnavailableError) {
      console.error("Service is temporarily unavailable.");
    } else if (error instanceof ModelResponseError) {
      console.error("Model returned an invalid response.");
    } else if (error instanceof OpenRouterError) {
      console.error(`OpenRouter error: ${error.message}`);
    } else {
      console.error("Unexpected error:", error);
    }
  }
}

// ============================================================================
// Example 4: Custom configuration (useful for testing)
// ============================================================================

export async function exampleCustomConfig() {
  const service = new OpenRouterService({
    apiKey: "custom-api-key",
    baseUrl: "https://custom-openrouter-endpoint.com/api/v1",
  });

  const response = await service.getChatCompletion<string>({
    model: "anthropic/claude-3.5-haiku",
    systemPrompt: "You are a helpful assistant.",
    userPrompt: "Hello!",
  });

  console.log(response);
}

// ============================================================================
// Example 5: Using different models
// ============================================================================

export async function exampleDifferentModels() {
  const service = new OpenRouterService();

  // Fast and cheap model for simple tasks
  const fastResponse = await service.getChatCompletion<string>({
    model: "anthropic/claude-3.5-haiku",
    systemPrompt: "You are a helpful assistant.",
    userPrompt: "What is 2+2?",
  });

  // More powerful model for complex tasks
  const powerfulResponse = await service.getChatCompletion<string>({
    model: "anthropic/claude-3.5-sonnet",
    systemPrompt: "You are an expert programmer.",
    userPrompt: "Explain the concept of closures in JavaScript.",
    temperature: 0.7,
    maxTokens: 1000,
  });

  console.log(fastResponse);
  console.log(powerfulResponse);
}

// ============================================================================
// Example 6: Temperature and creativity control
// ============================================================================

export async function exampleTemperatureControl() {
  const service = new OpenRouterService();

  // Low temperature (0.0-0.3) for deterministic, factual responses
  const factualResponse = await service.getChatCompletion<string>({
    model: "anthropic/claude-3.5-haiku",
    systemPrompt: "You are a factual assistant.",
    userPrompt: "What is the speed of light?",
    temperature: 0.1,
  });

  // High temperature (0.7-1.0) for creative responses
  const creativeResponse = await service.getChatCompletion<string>({
    model: "anthropic/claude-3.5-haiku",
    systemPrompt: "You are a creative writer.",
    userPrompt: "Write a short poem about coding.",
    temperature: 0.9,
  });

  console.log(factualResponse);
  console.log(creativeResponse);
}
