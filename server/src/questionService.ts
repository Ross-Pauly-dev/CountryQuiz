import { shuffle as lodashShuffle, sample, sampleSize } from 'lodash-es';
import type { RestCountry } from './types.js';
import type { Question } from './types.js';

const QUESTION_TYPES = [
  'capital',
  'currency',
  'region',
  'population',
  'flag',
] as const;
type QuestionType = (typeof QUESTION_TYPES)[number];

type QuestionPayload = Omit<Question, 'id'> & { id: string };

/** Shuffle a copy of the array (lodash mutates, so we copy first). */
function shuffle<T>(array: T[]): T[] {
  return lodashShuffle([...array]);
}

/** Convert cca2 (e.g. "GB") to regional indicator symbols for flag emoji */
function flagEmoji(cca2: string): string {
  return [...cca2]
    .map((c) => String.fromCodePoint(0x1f1e6 - 65 + c.charCodeAt(0)))
    .join('');
}

function getCountriesWithCapital(countries: RestCountry[]): RestCountry[] {
  return countries.filter(
    (c) => c.capital && c.capital.length > 0 && c.capital[0],
  );
}

function getCountriesWithCurrencySymbol(countries: RestCountry[]): RestCountry[] {
  return countries.filter((c) => {
    if (!c.currencies) return false;
    return Object.values(c.currencies).some((curr) => curr.symbol);
  });
}

function pickRandom<T>(arr: T[], n: number, exclude?: T): T[] {
  const pool = exclude ? arr.filter((x) => x !== exclude) : [...arr];
  return sampleSize(pool, n);
}

function pickRandomOne<T>(arr: T[]): T {
  return sample(arr)!;
}

function buildQuestion(
  id: string,
  questionText: string,
  correctValue: string,
  options: string[],
): QuestionPayload {
  const shuffled = shuffle(options);
  const correctIndex = shuffled.indexOf(correctValue);
  const correctId = String(correctIndex + 1);
  return {
    id,
    question: questionText,
    correctAnswerId: correctId,
    answers: shuffled.map((text, i) => ({
      id: String(i + 1),
      text,
    })),
  };
}

export function generateCapitalQuestion(
  countries: RestCountry[],
  questionId: string,
): QuestionPayload | null {
  const withCapital = getCountriesWithCapital(countries);
  if (withCapital.length < 4) return null;
  const correct = pickRandomOne(withCapital);
  const capital = correct.capital![0];
  const others = pickRandom(
    withCapital.map((c) => c.capital![0]),
    3,
    capital,
  );
  const options = [capital, ...others];
  return buildQuestion(
    questionId,
    `What is the capital of ${correct.name.common}?`,
    capital,
    options,
  );
}

export function generateCurrencyQuestion(
  countries: RestCountry[],
  questionId: string,
): QuestionPayload | null {
  const withCurrency = getCountriesWithCurrencySymbol(countries);
  if (withCurrency.length < 4) return null;
  const correct = pickRandomOne(withCurrency);
  const curr = Object.values(correct.currencies!).find((c) => c.symbol);
  const symbol = curr?.symbol ?? curr?.name ?? '';
  const otherSymbols = withCurrency
    .flatMap((c) =>
      Object.values(c.currencies ?? {}).map((x) => x.symbol ?? x.name),
    )
    .filter((s): s is string => Boolean(s));
  const uniq = [...new Set(otherSymbols)].filter((s) => s !== symbol);
  if (uniq.length < 3) return null;
  const others = pickRandom(uniq, 3);
  const options = [symbol, ...others];
  return buildQuestion(
    questionId,
    `What is the currency symbol of ${correct.name.common}?`,
    symbol,
    options,
  );
}

export function generateRegionQuestion(
  countries: RestCountry[],
  questionId: string,
): QuestionPayload | null {
  const regions = [...new Set(countries.map((c) => c.region).filter(Boolean))] as string[];
  if (countries.length < 4 || regions.length < 2) return null;
  const correct = pickRandomOne(countries);
  if (!correct.region) return null;
  const others = pickRandom(
    regions.filter((r) => r !== correct.region),
    3,
  );
  const options = [correct.region, ...others];
  return buildQuestion(
    questionId,
    `${correct.name.common} is a country in which continent?`,
    correct.region,
    options,
  );
}

export function generatePopulationQuestion(
  countries: RestCountry[],
  questionId: string,
): QuestionPayload | null {
  if (countries.length < 4) return null;
  const correct = pickRandomOne(countries);
  const pop = String(correct.population);
  const others = pickRandom(
    countries.map((c) => String(c.population)),
    3,
    pop,
  );
  const options = [pop, ...others];
  return buildQuestion(
    questionId,
    `What is the population of ${correct.name.common}?`,
    pop,
    options,
  );
}

export function generateFlagQuestion(
  countries: RestCountry[],
  questionId: string,
): QuestionPayload | null {
  if (countries.length < 4) return null;
  const correct = pickRandomOne(countries);
  const otherNames = pickRandom(
    countries.map((c) => c.name.common),
    3,
    correct.name.common,
  );
  const options = [correct.name.common, ...otherNames];
  return buildQuestion(
    questionId,
    `The flag ${flagEmoji(correct.cca2)} belongs to which country?`,
    correct.name.common,
    options,
  );
}

const questionGenerators: Record<
  QuestionType,
  (countries: RestCountry[], questionId: string) => QuestionPayload | null
> = {
  capital: generateCapitalQuestion,
  currency: generateCurrencyQuestion,
  region: generateRegionQuestion,
  population: generatePopulationQuestion,
  flag: generateFlagQuestion,
};

export function generateQuestions(
  countries: RestCountry[],
  count: number,
): Question[] {
  const MIN_COUNT = 1;
  const MAX_COUNT = 20;
  const numQuestions = Math.max(
    MIN_COUNT,
    Math.min(MAX_COUNT, Math.floor(count)),
  );

  const questions: Question[] = [];
  let id = 1;
  const typesOrder = shuffle([...QUESTION_TYPES]);
  let typeIndex = 0;
  let attempts = 0;
  const maxAttempts = numQuestions * 5;

  while (questions.length < numQuestions && attempts < maxAttempts) {
    attempts++;
    const type = typesOrder[typeIndex % typesOrder.length];
    typeIndex++;
    const generator = questionGenerators[type];
    const payload = generator(countries, String(id));
    if (payload) {
      questions.push(payload);
      id++;
    }
  }

  return questions;
}
