export const POP_TRANCHES = [
  { id: 'p1', label: '<5M', min: 0, max: 5_000_000 },
  { id: 'p2', label: '5–20M', min: 5_000_000, max: 20_000_000 },
  { id: 'p3', label: '20–60M', min: 20_000_000, max: 60_000_000 },
  { id: 'p4', label: '60–150M', min: 60_000_000, max: 150_000_000 },
  { id: 'p5', label: '>150M', min: 150_000_000, max: Infinity }
] as const;

export const AREA_TRANCHES = [
  { id: 'a1', label: '<100k', min: 0, max: 100_000 },
  { id: 'a2', label: '100–500k', min: 100_000, max: 500_000 },
  { id: 'a3', label: '500k–1M', min: 500_000, max: 1_000_000 },
  { id: 'a4', label: '1–3M', min: 1_000_000, max: 3_000_000 },
  { id: 'a5', label: '>3M', min: 3_000_000, max: Infinity }
] as const;
