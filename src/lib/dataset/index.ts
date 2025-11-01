import countriesData from './countries.json';

export type Continent =
  | 'Europe'
  | 'Africa'
  | 'Asia'
  | 'North America'
  | 'South America'
  | 'Oceania';

export type Country = {
  code: string;
  name: string;
  capital: string;
  continent: Continent;
  population: number;
  area_km2: number;
  flagSvgPath: string;
};

export const countries: Country[] = countriesData satisfies Country[];

export const countriesByCode: Map<string, Country> = new Map(
  countries.map((country) => [country.code, country])
);

export function getCountryByCode(code: string): Country | undefined {
  return countriesByCode.get(code);
}

export function filterCountries(excludeCodes: string[]): Country[] {
  const excludeSet = new Set(excludeCodes);
  return countries.filter((country) => !excludeSet.has(country.code));
}

export function getDistinctContinents(): Continent[] {
  return Array.from(new Set(countries.map((country) => country.continent)));
}

export function getRandomSubset<T>(items: readonly T[], count: number): T[] {
  if (count >= items.length) {
    return [...items];
  }

  const result: T[] = [];
  const used = new Set<number>();
  while (result.length < count) {
    const index = Math.floor(Math.random() * items.length);
    if (!used.has(index)) {
      result.push(items[index]);
      used.add(index);
    }
  }

  return result;
}
