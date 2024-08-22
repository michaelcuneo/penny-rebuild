<script>
	import { fade } from 'svelte/transition';
	import landing from '$lib/landing.svg';

	$: console.log(data);

	export let data;
</script>

<div class="page" in:fade>
	<div class="landing">
		<img width="100%" src={landing} alt="Stay, Connect, Reflect" />
	</div>
</div>

<style>
  .page {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100vw;
	}
	.landing {
		width: 800px;
	}
</style>
