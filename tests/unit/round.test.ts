import { describe, it, expect } from 'vitest';
import { createRound } from '$lib/game/round';
import { countries, getDistinctContinents } from '$lib/dataset';

const NUM_ROUNDS = 10;

describe('createRound', () => {
  it('generates rounds without repeating the flag', () => {
    const exclude: string[] = [];
    const flags = new Set<string>();

    for (let i = 0; i < NUM_ROUNDS; i += 1) {
      const round = createRound({ excludeCodes: exclude });
      expect(flags.has(round.flag.code)).toBe(false);
      flags.add(round.flag.code);
      exclude.push(round.flag.code);
    }
  });

  it('includes the correct answers in choices', () => {
    const round = createRound();

    const countryCodes = round.choices.countries.map((country) => country.code);
    expect(countryCodes).toHaveLength(4);
    expect(countryCodes.filter((code) => code === round.flag.code)).toHaveLength(1);
    expect(new Set(countryCodes).size).toBe(countryCodes.length);

    const capitals = round.choices.capitals;
    expect(capitals).toHaveLength(4);
    expect(capitals.filter((capital) => capital === round.flag.capital)).toHaveLength(1);
    expect(new Set(capitals).size).toBe(capitals.length);

    const continents = round.choices.continents;
    const allContinents = getDistinctContinents();
    expect(continents).toEqual(allContinents);
    expect(continents).toContain(round.flag.continent);

    expect(round.choices.popTranches).toHaveLength(5);
    expect(round.choices.areaTranches).toHaveLength(5);
  });

  it('can draw from a limited country list', () => {
    const sample = countries.slice(0, 8);
    const exclude: string[] = [];
    const codes = new Set<string>();

    for (let i = 0; i < sample.length; i += 1) {
      const round = createRound({ countriesList: sample, excludeCodes: exclude });
      expect(sample.map((country) => country.code)).toContain(round.flag.code);
      codes.add(round.flag.code);
      exclude.push(round.flag.code);
    }

    expect(codes.size).toBe(sample.length);
  });
});
