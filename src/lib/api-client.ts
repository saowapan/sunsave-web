import {
  QuoteInputs,
  QuoteResponse,
} from './contracts';

/**
 * Base URL for the API. Reads from env at build time; falls back to localhost
 * for local development.
 */
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api';

class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });

  if (!response.ok) {
    let body: unknown;
    try {
      body = await response.json();
    } catch {
      body = await response.text();
    }
    throw new ApiError(
      response.status,
      `API request failed: ${response.status}`,
      body,
    );
  }

  return response.json() as Promise<T>;
}

export const api = {
  createQuote(inputs: QuoteInputs): Promise<QuoteResponse> {
    return request<QuoteResponse>('/quotes', {
      method: 'POST',
      body: JSON.stringify(inputs),
    });
  },

  getQuote(id: string): Promise<QuoteResponse> {
    return request<QuoteResponse>(`/quotes/${id}`);
  },

  listRecentQuotes(limit = 20): Promise<QuoteResponse[]> {
    return request<QuoteResponse[]>(`/quotes?limit=${limit}`);
  },
};

export { ApiError };