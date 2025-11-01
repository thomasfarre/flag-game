<script lang="ts">
  import { onMount } from 'svelte';
  import FlagCard from './components/FlagCard.svelte';
  import Question, { type QuestionStatus } from './components/Question.svelte';
  import Choices, { type ChoiceItem, type ChoiceStatus } from './components/Choices.svelte';
  import TextAnswer, { type TextAnswerEventDetail } from './components/TextAnswer.svelte';
  import ProgressBar from './components/ProgressBar.svelte';
  import ScoreBadge from './components/ScoreBadge.svelte';
  import EndScreen from './components/EndScreen.svelte';
  import { game, startGame, answerCurrent, nextRound } from '$lib/stores/game';
  import type { GamePhase, GameState } from '$lib/stores/game';
  import type { Answers } from '$lib/game/scoring';
  import { getDistinctContinents } from '$lib/dataset';
  import {
    getPopulationTrancheLabel,
    getAreaTrancheLabel,
    getPopulationTrancheId,
    getAreaTrancheId
  } from '$lib/game/scoring';
  import { POP_TRANCHES, AREA_TRANCHES } from '$lib/game/tranches';

  const numberFormatter = new Intl.NumberFormat('fr-FR');

  let state: GameState = {
    rounds: [],
    currentIndex: 0,
    answersMap: {},
    resultsMap: {},
    scoreTotal: 0,
    phase: 'question'
  };

  let answers: Answers = {};
  let lastIndex = -1;
  let lastPhase: GamePhase | null = null;
  const formId = 'round-form';

  onMount(() => {
    startGame();
  });

  $: state = $game;

  $: if (state && (state.currentIndex !== lastIndex || state.phase !== lastPhase)) {
    answers = { ...(state.answersMap[state.currentIndex] ?? {}) };
    lastIndex = state.currentIndex;
    lastPhase = state.phase;
  }

  $: currentRound = state.rounds[state.currentIndex];
  $: currentResult = state.resultsMap[state.currentIndex];
  $: totalRounds = state.rounds.length || 10;
  $: isLastRound = state.currentIndex === state.rounds.length - 1;

  function setAnswer(key: keyof Answers, value: string) {
    answers = { ...answers, [key]: value };
  }

  type TextEvent = CustomEvent<TextAnswerEventDetail>;

  function handleTextInput(key: keyof Answers, event: TextEvent) {
    setAnswer(key, event.detail.value);
  }

  function handleTextBlur(key: keyof Answers, event: TextEvent) {
    setAnswer(key, event.detail.value);
  }

  function submit() {
    if (!currentRound || state.phase !== 'question') {
      return;
    }
    answerCurrent(answers);
  }

  function goNext() {
    if (state.phase === 'review') {
      nextRound();
    }
  }

  function replay() {
    const desiredRounds = state.rounds.length || 10;
    startGame(desiredRounds);
  }

  function formatPopulation(value: number): string {
    return `${numberFormatter.format(value)} hab.`;
  }

  function formatArea(value: number): string {
    return `${numberFormatter.format(value)} km²`;
  }

  function buildBinaryStatuses(
    correctId: string,
    selectedId: string | undefined,
    success: boolean | undefined
  ): Record<string, ChoiceStatus> {
    if (state.phase !== 'review') {
      return {};
    }
    const statuses: Record<string, ChoiceStatus> = { [correctId]: 'correct' };
    if (selectedId && selectedId !== correctId) {
      statuses[selectedId] = success ? 'correct' : 'incorrect';
    }
    return statuses;
  }

  function buildTrancheStatuses(
    correctId: string | undefined,
    selectedId: string | undefined,
    score: 0 | 1 | 2 | undefined
  ): Record<string, ChoiceStatus> {
    if (state.phase !== 'review' || !correctId) {
      return {};
    }

    const statuses: Record<string, ChoiceStatus> = { [correctId]: 'correct' };

    if (!selectedId || selectedId === correctId) {
      return statuses;
    }

    if (score === 1) {
      statuses[selectedId] = 'partial';
    } else {
      statuses[selectedId] = 'incorrect';
    }

    return statuses;
  }

  function getQuestionStatus(value: boolean | (0 | 1 | 2) | undefined): QuestionStatus {
    if (state.phase !== 'review' || value === undefined) {
      return 'pending';
    }
    if (value === true || value === 2) {
      return 'correct';
    }
    if (value === 1) {
      return 'partial';
    }
    return 'incorrect';
  }

  const CONTINENT_CHOICES: ChoiceItem[] = getDistinctContinents().map((continent) => ({
    id: continent,
    label: continent
  }));

  $: continentChoices = CONTINENT_CHOICES;

  $: populationChoices = POP_TRANCHES.map<ChoiceItem>((item) => ({
    id: item.id,
    label: item.label
  }));

  $: areaChoices = AREA_TRANCHES.map<ChoiceItem>((item) => ({
    id: item.id,
    label: item.label
  }));

  $: correctPopId = currentRound ? getPopulationTrancheId(currentRound.flag.population) : undefined;
  $: correctAreaId = currentRound ? getAreaTrancheId(currentRound.flag.area_km2) : undefined;

  $: continentStatuses = currentRound
    ? buildBinaryStatuses(currentRound.flag.continent, answers.continent, currentResult?.correct.continent)
    : {};
  $: populationStatuses = buildTrancheStatuses(correctPopId, answers.popTrancheId, currentResult?.correct.pop);
  $: areaStatuses = buildTrancheStatuses(correctAreaId, answers.areaTrancheId, currentResult?.correct.area);

  $: countryFeedback =
    state.phase === 'review' && currentRound
      ? currentResult?.correct.country
        ? `Parfait ! C'était bien ${currentRound.flag.name}.`
        : `Il fallait reconnaître ${currentRound.flag.name}.`
      : undefined;

  $: capitalFeedback =
    state.phase === 'review' && currentRound
      ? currentResult?.correct.capital
        ? `Exact, la capitale est ${currentRound.flag.capital}.`
        : `La bonne réponse : ${currentRound.flag.capital}.`
      : undefined;

  $: continentFeedback =
    state.phase === 'review' && currentRound
      ? currentResult?.correct.continent
        ? `Oui, ${currentRound.flag.name} est en ${currentRound.flag.continent}.`
        : `${currentRound.flag.name} est en ${currentRound.flag.continent}.`
      : undefined;

  $: populationFeedback =
    state.phase === 'review' && currentRound && correctPopId
      ? currentResult?.correct.pop === 2
        ? `Bravo ! Population ≈ ${formatPopulation(currentRound.flag.population)} → tranche ${getPopulationTrancheLabel(correctPopId)}.`
        : currentResult?.correct.pop === 1
        ? `Presque ! Population ≈ ${formatPopulation(currentRound.flag.population)} → tranche ${getPopulationTrancheLabel(correctPopId)}.`
        : `À retenir : population ≈ ${formatPopulation(currentRound.flag.population)} → tranche ${getPopulationTrancheLabel(correctPopId)}.`
      : undefined;

  $: areaFeedback =
    state.phase === 'review' && currentRound && correctAreaId
      ? currentResult?.correct.area === 2
        ? `Super ! Superficie ≈ ${formatArea(currentRound.flag.area_km2)} → tranche ${getAreaTrancheLabel(correctAreaId)}.`
        : currentResult?.correct.area === 1
        ? `Pas loin ! Superficie ≈ ${formatArea(currentRound.flag.area_km2)} → tranche ${getAreaTrancheLabel(correctAreaId)}.`
        : `Note-le : superficie ≈ ${formatArea(currentRound.flag.area_km2)} → tranche ${getAreaTrancheLabel(correctAreaId)}.`
      : undefined;
</script>

{#if state.phase === 'end'}
  <EndScreen
    rounds={state.rounds}
    answersMap={state.answersMap}
    resultsMap={state.resultsMap}
    totalScore={state.scoreTotal}
    maxScore={state.rounds.length * 9}
    on:replay={replay}
  />
{:else if currentRound}
  <div class="flex flex-col gap-6">
    <header class="grid gap-4 rounded-3xl border border-sky-100 bg-white/95 p-5 shadow-lg shadow-sky-100/50 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center lg:gap-6">
      <div class="w-full lg:pr-6">
        <ProgressBar current={state.currentIndex + 1} total={totalRounds} />
      </div>
      <div class="mx-auto w-full max-w-3xl lg:mx-0">
        <FlagCard country={currentRound.flag} phase={state.phase} />
      </div>
      <div class="flex w-full flex-col items-stretch gap-3 lg:items-end">
        <ScoreBadge score={state.scoreTotal} round={state.currentIndex + 1} totalRounds={totalRounds} />
        {#if state.phase === 'question'}
          <button
            type="submit"
            form={formId}
            class="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-400 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-100 transition hover:from-emerald-500 hover:via-emerald-600 hover:to-emerald-500"
          >
            Valider la manche
          </button>
        {:else if state.phase === 'review'}
          <div class="flex flex-wrap items-center justify-end gap-3 text-sm text-slate-600">
            <span class="inline-flex items-center rounded-full border border-sky-100 bg-white px-3 py-2 font-semibold text-sky-600 shadow-sm">
              +{currentResult?.points ?? 0} pts
            </span>
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-400 via-sky-500 to-sky-400 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-sky-200 transition hover:from-sky-500 hover:via-sky-600 hover:to-sky-500"
              on:click={goNext}
            >
              {isLastRound ? 'Voir le récapitulatif' : 'Question suivante'}
            </button>
          </div>
        {/if}
      </div>
    </header>

    {#if state.phase === 'review'}
      <p class="mx-auto w-full max-w-3xl rounded-3xl border border-amber-100 bg-amber-50/80 px-5 py-3 text-sm text-amber-700 shadow-sm">
        Revois tes réponses puis clique sur « Question suivante » pour continuer l'aventure.
      </p>
    {/if}

    <form id={formId} class="flex flex-col gap-5" on:submit|preventDefault={submit}>
      <div class="grid gap-2.5 md:grid-cols-2 xl:grid-cols-6">
        <Question
          title="Quel est ce pays ?"
          index={1}
          status={getQuestionStatus(currentResult?.correct.country)}
          feedback={countryFeedback}
          let:labelId
          compact
          className="xl:col-span-3"
        >
          <TextAnswer
            name="question-1-input"
            value={answers.country ?? ''}
            placeholder="Ex : France"
            labelledBy={labelId}
            disabled={state.phase !== 'question'}
            spellcheck={false}
            on:input={(event) => handleTextInput('country', event)}
            on:blur={(event) => handleTextBlur('country', event)}
          />
        </Question>

        <Question
          title="Quelle est sa capitale ?"
          index={2}
          status={getQuestionStatus(currentResult?.correct.capital)}
          feedback={capitalFeedback}
          let:labelId
          compact
          className="xl:col-span-3"
        >
          <TextAnswer
            name="question-2-input"
            value={answers.capital ?? ''}
            placeholder="Ex : Paris"
            labelledBy={labelId}
            disabled={state.phase !== 'question'}
            spellcheck={false}
            on:input={(event) => handleTextInput('capital', event)}
            on:blur={(event) => handleTextBlur('capital', event)}
          />
        </Question>

        <Question
          title="Sur quel continent se trouve ce pays ?"
          index={3}
          status={getQuestionStatus(currentResult?.correct.continent)}
          feedback={continentFeedback}
          let:labelId
          className="xl:col-span-2"
        >
          <Choices
            items={continentChoices}
            selectedId={answers.continent}
            name="question-3"
            disabled={state.phase !== 'question'}
            labelledBy={labelId}
            statuses={continentStatuses}
            on:change={(event) => setAnswer('continent', event.detail)}
          />
        </Question>

        <Question
          title="Dans quelle tranche de population ?"
          index={4}
          description="Habitants estimés"
          status={getQuestionStatus(currentResult?.correct.pop)}
          feedback={populationFeedback}
          let:labelId
          className="xl:col-span-2"
        >
          <Choices
            items={populationChoices}
            selectedId={answers.popTrancheId}
            name="question-4"
            disabled={state.phase !== 'question'}
            labelledBy={labelId}
            statuses={populationStatuses}
            on:change={(event) => setAnswer('popTrancheId', event.detail)}
          />
        </Question>

        <Question
          title="Quelle tranche de superficie ?"
          index={5}
          description="Kilomètres carrés"
          status={getQuestionStatus(currentResult?.correct.area)}
          feedback={areaFeedback}
          let:labelId
          className="xl:col-span-2"
        >
          <Choices
            items={areaChoices}
            selectedId={answers.areaTrancheId}
            name="question-5"
            disabled={state.phase !== 'question'}
            labelledBy={labelId}
            statuses={areaStatuses}
            on:change={(event) => setAnswer('areaTrancheId', event.detail)}
          />
        </Question>
      </div>
    </form>
  </div>
{:else}
  <div class="flex flex-1 items-center justify-center text-slate-200">Chargement…</div>
{/if}
