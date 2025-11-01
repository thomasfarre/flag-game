import type { Country, Continent } from '$lib/dataset';
import { POP_TRANCHES, AREA_TRANCHES } from './tranches';

export type PopulationTranche = (typeof POP_TRANCHES)[number];
export type AreaTranche = (typeof AREA_TRANCHES)[number];

export type QuestionKey =
  | 'country'
  | 'capital'
  | 'continent'
  | 'popTrancheId'
  | 'areaTrancheId';

export type RoundChoices = {
  countries: Country[];
  capitals: string[];
  continents: Continent[];
  popTranches: typeof POP_TRANCHES;
  areaTranches: typeof AREA_TRANCHES;
};

export type Round = {
  flag: Country;
  choices: RoundChoices;
};
