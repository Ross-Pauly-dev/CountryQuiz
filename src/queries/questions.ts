import { useQuery } from '@tanstack/react-query';
import type { Question } from '../store/types';

const QUESTIONS_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ??
  'http://localhost:3001';
const QUESTIONS_ENDPOINT = `${QUESTIONS_URL}/questions`;

export const questionsQueryKey = ['questions'] as const;

export async function fetchQuestions(): Promise<Question[]> {
  const res = await fetch(`${QUESTIONS_ENDPOINT}?count=10`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      (body as { error?: string })?.error ??
        `Failed to load questions (${res.status})`,
    );
  }
  return res.json();
}

export const questionsQueryOptions = {
  queryKey: questionsQueryKey,
  queryFn: fetchQuestions,
  retry: 1,
} as const;

export function useQuestionsQuery() {
  return useQuery(questionsQueryOptions);
}
