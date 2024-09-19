<script lang="ts">
  import { onMount } from 'svelte';

  let Player: any;
  let Video: any;
  let DefaultUi: any;

  onMount(async () => {
    // NOTE: parentheses turn destructuring assignments into expressions
    ({ Player, Video, DefaultUi } = await import('@vime/svelte'));
    Player.play();
  });

  export let src;
</script>

<svelte:component this={Player} autoplay playsinline muted>
  <svelte:component this={Video} crossorigin="">
    <!-- We turn off the controls that come with the default UI. -->
    <svelte:component this={DefaultUi} />
    <source data-src={src}>
  </svelte:component>
</svelte:component>

<style>
  :global(video) {
    width: auto;
    height: 100vh;
  }
</style>