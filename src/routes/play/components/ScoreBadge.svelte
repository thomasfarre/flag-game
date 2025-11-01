<script lang="ts">
  export let score = 0;
  export let round = 1;
  export let totalRounds = 10;
  export let maxPerRound = 9;

  $: maxScore = totalRounds * maxPerRound;
</script>

<div class="rounded-2xl border border-sky-100 bg-white/90 px-5 py-3 text-sm text-slate-600 shadow-md shadow-sky-100/40">
  <span class="font-semibold text-slate-900">Score :</span>
  <span class="font-semibold text-sky-500"> {score}</span>
  <span class="text-slate-400"> / {maxScore}</span>
  <span class="ml-3 inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-600">
    Manche {Math.min(round, totalRounds)} / {totalRounds}
  </span>
</div>
