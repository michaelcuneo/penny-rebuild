<script>
	import { fade } from 'svelte/transition';
	import pennyLanding from '$lib/pennyLanding.png';
</script>

<div class="page" in:fade>
	<img width="100%" src={pennyLanding} alt="Stay, Connect, Reflect" />
</div>

<style>
  .page {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100vw;
	}
</style>
