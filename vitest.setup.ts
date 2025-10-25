import { vi } from "vitest";
import "@testing-library/jest-dom";

// Mock Supabase client globally
export const mockSupabaseFrom = vi.fn();
export const mockSupabaseAuth = vi.fn();

export const createMockSupabaseClient = () => ({
  from: mockSupabaseFrom,
  auth: mockSupabaseAuth,
});

// Reset all mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
});
