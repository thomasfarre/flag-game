<script lang="ts">
  import { goto } from '$app/navigation';

  function start() {
    void goto('/play');
  }
</script>

<main class="flex flex-1 flex-col items-center justify-center gap-8 text-center">
  <div class="space-y-4">
    <span class="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-sky-600">Jeu solo</span>
    <h1 class="text-4xl font-bold text-slate-900 sm:text-5xl">Flags Quiz</h1>
    <p class="mx-auto max-w-xl text-lg text-slate-600">
      Reconnais les drapeaux, capitales et continents de 10 pays choisis au hasard. Score maximum :
      90 points. Prêt·e à relever le défi ?
    </p>
  </div>

  <button
    class="rounded-full bg-gradient-to-r from-sky-400 via-sky-500 to-sky-400 px-10 py-3 text-lg font-semibold text-white shadow-lg shadow-sky-200 transition hover:from-sky-500 hover:via-sky-600 hover:to-sky-500"
    on:click={start}
  >
    Jouer
  </button>
</main>
