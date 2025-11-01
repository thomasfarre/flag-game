<script lang="ts">
  import type { Country } from '$lib/dataset';
  import type { GamePhase } from '$lib/stores/game';

  export let country: Country;
  export let phase: GamePhase = 'question';

  const fallbackClass = 'fi-un';

  $: accessibleLabel =
    phase === 'question' ? 'Drapeau mystère' : `Drapeau de ${country.name}`;

  $: rawClass =
    country.flagSvgPath && country.flagSvgPath.includes('fi')
      ? country.flagSvgPath
      : `fi-${country.code.toLowerCase()}`;

  $: normalizedClass = rawClass.includes('fi-')
    ? rawClass.replace('fi ', '').trim()
    : fallbackClass;

  $: finalClass = `fi ${normalizedClass || fallbackClass}`;
</script>

<div
  class="flex flex-col items-center gap-6 "
  role="img"
  aria-label={accessibleLabel}
>
  <span
    class={`block overflow-hidden rounded-[2.5rem] shadow-[0_35px_70px_-30px_rgba(14,116,144,0.45)] ring-8 ring-white drop-shadow-xl ${finalClass}`}
    style="font-size: clamp(8rem, 80vw, 8rem);"
    aria-hidden="true"
  />
  {#if phase !== 'question'}
    <p class="text-base font-semibold text-slate-800">
      {country.name} <span class="text-slate-500">({country.code})</span>
    </p>
  {/if}
</div>
