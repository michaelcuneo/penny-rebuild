<script>
	import { fade } from 'svelte/transition';
	import landing from '$lib/landing.svg';
</script>

<div class="page" in:fade>
	<img width="100%" src={landing} alt="Stay, Connect, Reflect" />
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
