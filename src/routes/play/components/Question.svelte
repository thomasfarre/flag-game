<script lang="ts">
  import type { IconName } from '$lib/ui/icons';
  import { icons } from '$lib/ui/icons';

  export type QuestionStatus = 'pending' | 'correct' | 'incorrect' | 'partial';

  export let title: string;
  export let description: string | undefined = undefined;
  export let status: QuestionStatus = 'pending';
  export let feedback: string | undefined = undefined;
  export let index: number | undefined = undefined;
  export let compact = false;
  export let className = '';

  const statusIcon: Record<QuestionStatus, IconName | null> = {
    pending: null,
    correct: 'tick',
    incorrect: 'cross',
    partial: 'info'
  };

  const statusClass: Record<QuestionStatus, string> = {
    pending: 'text-slate-400',
    correct: 'text-emerald-500',
    incorrect: 'text-rose-500',
    partial: 'text-amber-500'
  };

  $: iconName = statusIcon[status];
  $: iconMarkup = iconName ? icons[iconName] : '';
  $: labelId = index !== undefined ? `question-${index}` : undefined;
  $: baseClasses = compact
    ? 'space-y-1.5 rounded-2xl border border-sky-100 bg-white/95 p-3 shadow-md shadow-sky-100/30'
    : 'space-y-2 rounded-3xl border border-sky-100 bg-white/95 p-4 shadow-md shadow-sky-100/50';
  $: headerGap = compact ? 'gap-2' : 'gap-3';
  $: titleClass = compact ? 'text-sm font-semibold text-slate-900' : 'text-base font-semibold text-slate-900';
  $: descriptionClass = 'text-xs text-slate-500';
  $: bodySpacing = compact ? 'space-y-1.5' : 'space-y-2';
  $: feedbackClass = compact ? 'text-[0.7rem]' : 'text-xs';
  $: iconSize = compact ? 'h-8 w-8' : 'h-9 w-9';
</script>

<section class={`${baseClasses} ${className} transition duration-200 hover:-translate-y-0.5 hover:shadow-lg`} aria-labelledby={labelId}>
  <header class={`flex items-start justify-between ${headerGap}`}>
    <div class={compact ? 'space-y-0.5' : 'space-y-0.5'}>
      <h2 id={labelId} class={titleClass}>{title}</h2>
      {#if description}
        <p class={descriptionClass}>{description}</p>
      {/if}
    </div>
    {#if iconMarkup}
      <span class={`inline-flex ${iconSize} shrink-0 items-center justify-center rounded-full bg-sky-100 ${statusClass[status]}`} aria-hidden="true">
        {@html iconMarkup}
      </span>
    {/if}
  </header>
  <div class={bodySpacing}>
    <slot {labelId} />
    {#if feedback}
      <p class={`${feedbackClass} ${statusClass[status]}`}>{feedback}</p>
    {/if}
  </div>
</section>
