<script lang="ts">
  export let current = 1;
  export let total = 1;

  $: clampedCurrent = Math.min(Math.max(current, 0), total);
  $: ratio = total > 0 ? clampedCurrent / total : 0;
  $: percent = Math.round(ratio * 100);
  $: label = `Manche ${clampedCurrent} sur ${total}`;
</script>

<div class="flex flex-col gap-2" aria-live="polite">
  <div class="flex items-center justify-between text-sm text-slate-500">
    <span>{label}</span>
    <span>{percent}%</span>
  </div>
  <div
    class="h-3 rounded-full bg-sky-100 shadow-inner"
    role="progressbar"
    aria-valuemin="0"
    aria-valuemax={total}
    aria-valuenow={clampedCurrent}
    aria-label={label}
  >
    <div
      class="h-3 rounded-full bg-gradient-to-r from-sky-400 via-sky-500 to-sky-400 transition-[width]"
      style={`width: ${percent}%;`}
    />
  </div>
</div>
