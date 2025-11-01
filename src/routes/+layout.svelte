<script lang="ts">
  import '../app.css';
  import 'flag-icons/css/flag-icons.min.css';
</script>

<svelte:head>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Flags Quiz</title>
</svelte:head>

<div class="min-h-screen text-slate-900">
  <div class="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-14 pt-10 sm:px-8 lg:px-12">
    <slot />
  </div>
</div>
