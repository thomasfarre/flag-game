<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export type ChoiceItem = {
    id: string;
    label: string;
    description?: string;
  };

  export type ChoiceStatus = 'neutral' | 'correct' | 'incorrect' | 'partial';

  export let items: ChoiceItem[] = [];
  export let selectedId: string | undefined = undefined;
  export let name: string;
  export let disabled = false;
  export let statuses: Record<string, ChoiceStatus> = {};
  export let labelledBy: string | undefined = undefined;

  const dispatch = createEventDispatcher<{ change: string }>();

  let buttons: Array<HTMLButtonElement | null> = [];

  $: isReview = Object.values(statuses).some((status) => status !== 'neutral');

  function updateSelection(id: string) {
    if (disabled) {
      return;
    }
    dispatch('change', id);
  }

  function focusButton(index: number) {
    const button = buttons[index];
    if (button) {
      button.focus();
    }
  }

  function handleKeydown(event: KeyboardEvent, index: number) {
    if (items.length === 0) {
      return;
    }

    const isPrev = event.key === 'ArrowUp' || event.key === 'ArrowLeft';
    const isNext = event.key === 'ArrowDown' || event.key === 'ArrowRight';

    if (!isPrev && !isNext) {
      if ((event.key === ' ' || event.key === 'Enter') && !disabled) {
        event.preventDefault();
        updateSelection(items[index].id);
      }
      return;
    }

    event.preventDefault();
    const delta = isPrev ? -1 : 1;
    const nextIndex = (index + delta + items.length) % items.length;
    focusButton(nextIndex);
  }

  function getStatus(id: string): ChoiceStatus {
    return statuses[id] ?? 'neutral';
  }

  function getButtonClasses(id: string, isSelected: boolean): string {
    const status = getStatus(id);
    const base = 'w-full rounded-xl border px-3 py-2 text-left text-sm transition shadow-sm focus-visible:outline-none';
    const selected = !isReview && isSelected ? ' border-sky-400 bg-sky-100 text-sky-900 ring-2 ring-sky-200' : '';
    const reviewClass: Record<ChoiceStatus, string> = {
      neutral: 'border-slate-200 bg-white hover:border-sky-200 hover:bg-sky-50',
      correct: 'border-emerald-400 bg-emerald-50 text-emerald-700',
      incorrect: 'border-rose-400 bg-rose-50 text-rose-700',
      partial: 'border-amber-300 bg-amber-50 text-amber-700'
    };

    return `${base} ${reviewClass[status]}${selected}`;
  }
</script>

<div
  class="grid grid-cols-2 gap-2"
  role="radiogroup"
  aria-labelledby={labelledBy ?? name}
  aria-disabled={disabled}
>
  {#each items as item, index}
    <button
      bind:this={buttons[index]}
      type="button"
      class={getButtonClasses(item.id, selectedId === item.id)}
      role="radio"
      aria-checked={selectedId === item.id ? 'true' : 'false'}
      {disabled}
      tabindex={selectedId === item.id || (!selectedId && index === 0) ? 0 : -1}
      on:click={() => updateSelection(item.id)}
      on:keydown={(event) => handleKeydown(event, index)}
    >
      <span class="block text-sm font-semibold text-slate-900">{item.label}</span>
      {#if item.description}
        <span class="text-xs text-slate-500">{item.description}</span>
      {/if}
    </button>
  {/each}
</div>
