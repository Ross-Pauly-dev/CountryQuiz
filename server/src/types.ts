// Duplicated from frontend for server response shape

export interface AnswerOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  question: string;
  correctAnswerId: string;
  answers: AnswerOption[];
}

// REST Countries API (v3.1) response types for fields we request
export interface RestCountry {
  name: { common: string; official: string };
  capital?: string[];
  currencies?: Record<string, { name: string; symbol?: string }>;
  region: string;
  population: number;
  flags: { png?: string; svg?: string };
  cca2: string; // 2-letter code for flag emoji
}
