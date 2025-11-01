import type { Continent } from '$lib/dataset';
import type { Country } from '$lib/dataset';
import { POP_TRANCHES, AREA_TRANCHES } from './tranches';

export type Answers = {
  country?: string;
  capital?: string;
  continent?: Continent;
  popTrancheId?: string;
  areaTrancheId?: string;
};

export type RoundResult = {
  correct: {
    country: boolean;
    capital: boolean;
    continent: boolean;
    pop: 0 | 1 | 2;
    area: 0 | 1 | 2;
  };
  points: number;
};

const ACCENT_REGEX = /[\u0300-\u036f]/g;
const NON_ALPHANUMERIC_REGEX = /[^a-z0-9]/g;

function normalizeText(value: string | undefined): string | undefined {
  if (!value) {
    return undefined;
  }
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(ACCENT_REGEX, '')
    .replace(NON_ALPHANUMERIC_REGEX, '');
}

function uniqueNormalized(values: string[]): string[] {
  const seen = new Set<string>();
  for (const value of values) {
    const normalized = normalizeText(value);
    if (normalized) {
      seen.add(normalized);
    }
  }
  return Array.from(seen);
}

function getCountryCandidates(target: Country): string[] {
  const baseVariants = [
    target.code,
    target.name,
    target.name.replace(/[^A-Za-z0-9 ]/g, ' '),
    target.name.replace(/[^A-Za-z0-9]/g, '')
  ];
  return uniqueNormalized(baseVariants);
}

function getCapitalCandidates(capital: string): string[] {
  const sanitized = capital.replace(/\(.*?\)/g, ' ').replace(/[,\-]/g, ' ');
  const firstSegment = capital.split(/[,(]/)[0];
  const firstWord = capital.split(/\s+/)[0];
  const variants = [
    capital,
    sanitized,
    firstSegment,
    sanitized.replace(/\s+/g, ' '),
    firstWord
  ];
  return uniqueNormalized(variants);
}

function matchesCountryAnswer(answer: string | undefined, target: Country): boolean {
  const normalizedAnswer = normalizeText(answer);
  if (!normalizedAnswer) {
    return false;
  }
  const candidates = getCountryCandidates(target);
  return candidates.includes(normalizedAnswer);
}

function matchesCapitalAnswer(answer: string | undefined, capital: string): boolean {
  const normalizedAnswer = normalizeText(answer);
  if (!normalizedAnswer) {
    return false;
  }
  const candidates = getCapitalCandidates(capital);
  return candidates.includes(normalizedAnswer);
}

function findTrancheIndex(value: number, ranges: readonly { id: string; min: number; max: number }[]): number {
  return ranges.findIndex((tranche) => value >= tranche.min && value < tranche.max);
}

function scoreTranche(answerId: string | undefined, value: number, ranges: typeof POP_TRANCHES | typeof AREA_TRANCHES): 0 | 1 | 2 {
  const correctIndex = findTrancheIndex(value, ranges);
  if (correctIndex === -1) {
    return 0;
  }
  if (!answerId) {
    return 0;
  }

  const answerIndex = ranges.findIndex((tranche) => tranche.id === answerId);
  if (answerIndex === -1) {
    return 0;
  }

  if (answerIndex === correctIndex) {
    return 2;
  }

  if (Math.abs(answerIndex - correctIndex) === 1) {
    return 1;
  }

  return 0;
}

export function scoreRound(target: Country, answers: Answers): RoundResult {
  const countryCorrect = matchesCountryAnswer(answers.country, target);
  const capitalCorrect = matchesCapitalAnswer(answers.capital, target.capital);

  const countryScore = countryCorrect ? 2 : 0;
  const capitalScore = capitalCorrect ? 2 : 0;
  const continentScore = answers.continent === target.continent ? 1 : 0;
  const popScore = scoreTranche(answers.popTrancheId, target.population, POP_TRANCHES);
  const areaScore = scoreTranche(answers.areaTrancheId, target.area_km2, AREA_TRANCHES);

  const points = countryScore + capitalScore + continentScore + popScore + areaScore;

  return {
    correct: {
      country: countryCorrect,
      capital: capitalCorrect,
      continent: continentScore > 0,
      pop: popScore as 0 | 1 | 2,
      area: areaScore as 0 | 1 | 2
    },
    points
  };
}

export function getPopulationTrancheLabel(id: string | undefined): string | undefined {
  return POP_TRANCHES.find((tranche) => tranche.id === id)?.label;
}

export function getAreaTrancheLabel(id: string | undefined): string | undefined {
  return AREA_TRANCHES.find((tranche) => tranche.id === id)?.label;
}

export function getPopulationTrancheId(value: number): string | undefined {
  const index = findTrancheIndex(value, POP_TRANCHES);
  return index === -1 ? undefined : POP_TRANCHES[index].id;
}

export function getAreaTrancheId(value: number): string | undefined {
  const index = findTrancheIndex(value, AREA_TRANCHES);
  return index === -1 ? undefined : AREA_TRANCHES[index].id;
}
