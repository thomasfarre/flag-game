import { describe, it, expect } from 'vitest';
import { countries } from '$lib/dataset';
import {
  scoreRound,
  type Answers,
  getPopulationTrancheId,
  getAreaTrancheId
} from '$lib/game/scoring';

const getCountry = (code: string) => {
  const country = countries.find((item) => item.code === code);
  if (!country) {
    throw new Error(`Country ${code} not found`);
  }
  return country;
};

describe('scoreRound', () => {
  it('returns 9 points for perfect answers', () => {
    const france = getCountry('FR');
    const answers: Answers = {
      country: 'FR',
      capital: 'Paris',
      continent: 'Europe',
      popTrancheId: getPopulationTrancheId(france.population),
      areaTrancheId: getAreaTrancheId(france.area_km2)
    };

    const result = scoreRound(france, answers);

    expect(result.points).toBe(9);
    expect(result.correct.country).toBe(true);
    expect(result.correct.capital).toBe(true);
    expect(result.correct.continent).toBe(true);
    expect(result.correct.pop).toBe(2);
    expect(result.correct.area).toBe(2);
  });

  it('accepts free-text answers ignoring case and accents', () => {
    const france = getCountry('FR');
    const answers: Answers = {
      country: 'france',
      capital: 'paris ',
      continent: 'Europe',
      popTrancheId: getPopulationTrancheId(france.population),
      areaTrancheId: getAreaTrancheId(france.area_km2)
    };

    const result = scoreRound(france, answers);

    expect(result.correct.country).toBe(true);
    expect(result.correct.capital).toBe(true);
    expect(result.points).toBe(9);
  });

  it('awards partial points for adjacent tranches', () => {
    const japan = getCountry('JP');
    const answers: Answers = {
      country: 'US',
      capital: 'Kyoto',
      continent: 'Asia',
      popTrancheId: 'p5',
      areaTrancheId: 'a3'
    };

    const result = scoreRound(japan, answers);

    expect(result.points).toBe(3);
    expect(result.correct.country).toBe(false);
    expect(result.correct.capital).toBe(false);
    expect(result.correct.continent).toBe(true);
    expect(result.correct.pop).toBe(1);
    expect(result.correct.area).toBe(1);
  });

  it('gives zero points for far tranches', () => {
    const brazil = getCountry('BR');
    const answers: Answers = {
      country: 'FR',
      capital: 'Brasília',
      continent: 'Africa',
      popTrancheId: 'p1',
      areaTrancheId: 'a1'
    };

    const result = scoreRound(brazil, answers);

    expect(result.points).toBe(2);
    expect(result.correct.country).toBe(false);
    expect(result.correct.capital).toBe(true);
    expect(result.correct.continent).toBe(false);
    expect(result.correct.pop).toBe(0);
    expect(result.correct.area).toBe(0);
  });
});
