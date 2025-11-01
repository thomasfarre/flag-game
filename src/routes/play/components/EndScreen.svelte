<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Answers, RoundResult } from '$lib/game/scoring';
  import {
    getAreaTrancheLabel,
    getPopulationTrancheLabel,
    getAreaTrancheId,
    getPopulationTrancheId
  } from '$lib/game/scoring';
  import type { Round } from '$lib/game/types';
  import { countriesByCode } from '$lib/dataset';

  export let rounds: Round[] = [];
  export let answersMap: Record<number, Answers> = {};
  export let resultsMap: Record<number, RoundResult> = {};
  export let totalScore = 0;
  export let maxScore = 90;

  const dispatch = createEventDispatcher<{ replay: void }>();

  const numberFormatter = new Intl.NumberFormat('fr-FR');

  function formatPopulation(value: number): string {
    return `${numberFormatter.format(value)} hab.`;
  }

  function formatArea(value: number): string {
    return `${numberFormatter.format(value)} km²`;
  }

  function describeCountryAnswer(value: string | undefined): string {
    if (!value) {
      return '—';
    }
    const trimmed = value.trim();
    if (!trimmed) {
      return '—';
    }
    const fromCode = countriesByCode.get(trimmed.toUpperCase());
    if (fromCode) {
      return `${trimmed.toUpperCase()} (${fromCode.name})`;
    }
    return trimmed;
  }

  function describeCapitalAnswer(value: string | undefined): string {
    if (!value) {
      return '—';
    }
    const trimmed = value.trim();
    return trimmed ? trimmed : '—';
  }
</script>

<section class="space-y-8 rounded-[2.25rem] border border-sky-100 bg-white/95 p-8 shadow-2xl shadow-sky-100/60">
  <div class="space-y-3 text-center">
    <h2 class="text-3xl font-bold text-slate-900">Bravo !</h2>
    <p class="text-lg text-slate-600">
      Score final : <span class="font-semibold text-sky-500">{totalScore}</span> / {maxScore}
    </p>
    <button
      class="mt-2 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-400 via-sky-500 to-sky-400 px-6 py-2 text-base font-semibold text-white shadow-md shadow-sky-200 transition hover:from-sky-500 hover:via-sky-600 hover:to-sky-500"
      on:click={() => dispatch('replay')}
    >
      Rejouer
    </button>
  </div>

  <div class="space-y-5">
    <h3 class="text-xl font-semibold text-slate-800">Récapitulatif des 10 manches</h3>
    <ol class="grid gap-4 lg:grid-cols-2">
      {#each rounds as round, index}
        {#if round}
          {@const answers = answersMap[index] ?? {}}
          {@const result = resultsMap[index]}
          <li class="space-y-4 rounded-3xl border border-sky-100 bg-gradient-to-br from-white via-sky-50 to-rose-50 p-5 shadow-lg shadow-sky-100/60">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div class="space-y-1">
                <h4 class="text-lg font-semibold text-slate-900">Manche {index + 1} — {round.flag.name}</h4>
                <p class="text-sm text-slate-500">Points : {result ? result.points : 0} / 9</p>
              </div>
              <span class="rounded-full border border-sky-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-600">
                {round.flag.continent}
              </span>
            </div>
            <dl class="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              <div class="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm">
                <dt class="text-xs font-semibold uppercase tracking-wide text-slate-400">Pays</dt>
                <dd class="mt-1 text-slate-600">
                  Ta réponse : {describeCountryAnswer(answers.country)}<br />
                  Bonne réponse : <span class="font-semibold text-slate-900">{round.flag.name}</span>
                </dd>
              </div>
              <div class="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm">
                <dt class="text-xs font-semibold uppercase tracking-wide text-slate-400">Capitale</dt>
                <dd class="mt-1 text-slate-600">
                  Ta réponse : {describeCapitalAnswer(answers.capital)}<br />
                  Bonne réponse : <span class="font-semibold text-slate-900">{round.flag.capital}</span>
                </dd>
              </div>
              <div class="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm">
                <dt class="text-xs font-semibold uppercase tracking-wide text-slate-400">Continent</dt>
                <dd class="mt-1 text-slate-600">
                  Ta réponse : {answers.continent ?? '—'}<br />
                  Bonne réponse : <span class="font-semibold text-slate-900">{round.flag.continent}</span>
                </dd>
              </div>
              <div class="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm">
                <dt class="text-xs font-semibold uppercase tracking-wide text-slate-400">Population</dt>
                <dd class="mt-1 text-slate-600">
                  Ta réponse : {getPopulationTrancheLabel(answers.popTrancheId) ?? '—'}<br />
                  Bonne réponse : {getPopulationTrancheLabel(getPopulationTrancheId(round.flag.population)) ?? '—'}
                  <span class="block text-xs text-slate-400">≈ {formatPopulation(round.flag.population)}</span>
                </dd>
              </div>
              <div class="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm sm:col-span-2">
                <dt class="text-xs font-semibold uppercase tracking-wide text-slate-400">Superficie</dt>
                <dd class="mt-1 text-slate-600">
                  Ta réponse : {getAreaTrancheLabel(answers.areaTrancheId) ?? '—'}<br />
                  Bonne réponse : {getAreaTrancheLabel(getAreaTrancheId(round.flag.area_km2)) ?? '—'}
                  <span class="block text-xs text-slate-400">≈ {formatArea(round.flag.area_km2)}</span>
                </dd>
              </div>
            </dl>
          </li>
        {/if}
      {/each}
    </ol>
  </div>
</section>
