import type { RestCountry } from './types.js';

const REST_COUNTRIES_BASE_URL =
  process.env.REST_COUNTRIES_BASE_URL ?? 'https://restcountries.com';
const FIELDS = [
  'name',
  'capital',
  'currencies',
  'region',
  'population',
  'flags',
  'cca2',
] as const;
const FIELDS_QUERY = FIELDS.join(',');

export async function fetchAllCountries(): Promise<RestCountry[]> {
  const url = `${REST_COUNTRIES_BASE_URL}/v3.1/all?fields=${FIELDS_QUERY}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(
      `REST Countries API error: ${res.status} ${res.statusText}`,
    );
  }

  const data = (await res.json()) as RestCountry[];
  if (!Array.isArray(data)) {
    throw new Error('REST Countries API returned invalid response');
  }
  return data;
}
