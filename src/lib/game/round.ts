import { countries, filterCountries, getDistinctContinents } from '$lib/dataset';
import type { Country } from '$lib/dataset';
import { AREA_TRANCHES, POP_TRANCHES } from './tranches';
import { shuffle } from './shuffle';
import type { Round } from './types';

export type RoundOptions = {
  countriesList?: Country[];
  excludeCodes?: string[];
  numChoices?: number;
};

function sampleCountry(pool: Country[]): Country {
  const index = Math.floor(Math.random() * pool.length);
  return pool[index];
}

function buildCountryChoices(flag: Country, pool: Country[], count: number): Country[] {
  const others = pool.filter((country) => country.code !== flag.code);
  const shuffledOthers = shuffle(others);
  const needed = Math.max(0, count - 1);
  const distractors = shuffledOthers.slice(0, needed);

  if (distractors.length < needed) {
    for (const country of others) {
      if (distractors.length >= needed) {
        break;
      }
      if (!distractors.includes(country)) {
        distractors.push(country);
      }
    }
  }

  return shuffle([...distractors, flag]);
}

function buildCapitalChoices(flag: Country, candidates: Country[], count: number): string[] {
  const otherCapitals = candidates
    .filter((country) => country.code !== flag.code)
    .map((country) => country.capital);
  const shuffled = shuffle(otherCapitals).filter((capital) => capital !== flag.capital);
  const needed = Math.max(0, count - 1);
  const distractors = shuffled.slice(0, needed);

  if (distractors.length < needed) {
    for (const capital of otherCapitals) {
      if (distractors.length >= needed) {
        break;
      }
      if (!distractors.includes(capital) && capital !== flag.capital) {
        distractors.push(capital);
      }
    }
  }

  return shuffle([...distractors, flag.capital]);
}

export function createRound(options: RoundOptions = {}): Round {
  const { countriesList = countries, excludeCodes = [], numChoices = 4 } = options;
  const pool = filterCountries(excludeCodes).filter((country) =>
    countriesList.some((candidate) => candidate.code === country.code)
  );

  const basePool = pool.length > 0 ? pool : countriesList;
  const flag = sampleCountry(basePool);
  const choicePool = countriesList;

  const countryChoices = buildCountryChoices(flag, choicePool, numChoices);
  const capitalChoices = buildCapitalChoices(flag, choicePool, numChoices);
  const continentChoices = getDistinctContinents();

  return {
    flag,
    choices: {
      countries: countryChoices,
      capitals: capitalChoices,
      continents: continentChoices,
      popTranches: POP_TRANCHES,
      areaTranches: AREA_TRANCHES
    }
  };
}
