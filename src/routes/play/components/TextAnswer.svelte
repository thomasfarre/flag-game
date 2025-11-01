<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export type TextAnswerEventDetail = {
    value: string;
  };

  export let value = '';
  export let name: string;
  export let labelledBy: string | undefined = undefined;
  export let placeholder = '';
  export let disabled = false;
  export let autocomplete = 'off';
  export let spellcheck = true;
  export let inputMode: HTMLInputElement['inputMode'] = 'text';

  const dispatch = createEventDispatcher<{ input: TextAnswerEventDetail; blur: TextAnswerEventDetail }>();

  let internalValue = value ?? '';

  $: if (value !== internalValue) {
    internalValue = value ?? '';
  }
</script>

<div class="relative">
  <input
    id={name}
    name={name}
    class="w-full rounded-xl border border-sky-100 bg-white/90 px-4 py-3 text-base text-slate-900 shadow-sm transition focus:border-sky-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400 md:max-w-[18rem]"
    type="text"
    value={internalValue}
    aria-labelledby={labelledBy}
    placeholder={placeholder}
    {disabled}
    {autocomplete}
    {spellcheck}
    {inputMode}
    on:input={(event) => {
      internalValue = (event.target).value;
      dispatch('input', { value: internalValue });
    }}
    on:blur={() => {
      const trimmed = internalValue.trim();
      internalValue = trimmed;
      dispatch('blur', { value: trimmed });
    }}
  />
</div>
