import { writable, get } from 'svelte/store';
import type { Answers, RoundResult } from '$lib/game/scoring';
import { scoreRound } from '$lib/game/scoring';
import { createRound } from '$lib/game/round';
import type { Round } from '$lib/game/types';
import { countries } from '$lib/dataset';

export type GamePhase = 'question' | 'review' | 'end';

export type AnswersMap = Record<number, Answers>;
export type ResultsMap = Record<number, RoundResult>;

export type GameState = {
  rounds: Round[];
  currentIndex: number;
  answersMap: AnswersMap;
  resultsMap: ResultsMap;
  scoreTotal: number;
  phase: GamePhase;
};

function createInitialState(): GameState {
  return {
    rounds: [],
    currentIndex: 0,
    answersMap: {},
    resultsMap: {},
    scoreTotal: 0,
    phase: 'question'
  };
}

const gameStore = writable<GameState>(createInitialState());

function generateRounds(roundCount: number): Round[] {
  const targetCount = Math.min(roundCount, countries.length);
  const rounds: Round[] = [];
  const usedCodes = new Set<string>();

  while (rounds.length < targetCount) {
    const round = createRound({ excludeCodes: Array.from(usedCodes) });
    if (usedCodes.has(round.flag.code)) {
      continue;
    }
    rounds.push(round);
    usedCodes.add(round.flag.code);
  }

  return rounds;
}

export function startGame(roundCount = 10): void {
  const rounds = generateRounds(roundCount);
  gameStore.set({
    rounds,
    currentIndex: 0,
    answersMap: {},
    resultsMap: {},
    scoreTotal: 0,
    phase: 'question'
  });
}

export function answerCurrent(answers: Answers): void {
  gameStore.update((state) => {
    if (state.phase !== 'question') {
      return state;
    }

    const round = state.rounds[state.currentIndex];
    if (!round) {
      return state;
    }

    const result = scoreRound(round.flag, answers);
    const answersMap = { ...state.answersMap, [state.currentIndex]: answers };
    const resultsMap = { ...state.resultsMap, [state.currentIndex]: result };
    const scoreDelta = result.points;

    return {
      ...state,
      answersMap,
      resultsMap,
      scoreTotal: state.scoreTotal + scoreDelta,
      phase: 'review'
    };
  });
}

export function nextRound(): void {
  gameStore.update((state) => {
    if (state.phase !== 'review') {
      return state;
    }

    const isLastRound = state.currentIndex >= state.rounds.length - 1;
    if (isLastRound) {
      return {
        ...state,
        phase: 'end'
      };
    }

    return {
      ...state,
      currentIndex: state.currentIndex + 1,
      phase: 'question'
    };
  });
}

export function resetGame(): void {
  gameStore.set(createInitialState());
}

export function getState(): GameState {
  return get(gameStore);
}

export const game = {
  subscribe: gameStore.subscribe
};
