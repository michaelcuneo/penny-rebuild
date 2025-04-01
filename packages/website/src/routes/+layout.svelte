<script lang="ts">
	import Header from './Header.svelte';
	import Footer from './Footer.svelte';
	import BurgerMenu from '$lib/BurgerMenu.svelte';

	import 'sanitize.css';
	import './styles.css';
	import './filepond.css';
	import './filepond-plugin-image-preview.css';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="wrap">
	<Header />
	{@render children?.()}
</div>
<Footer />

<BurgerMenu />

<style>
	.wrap {
		display: flex;
		flex-direction: column;
		min-height: calc(100vh - 309px);
	}
</style>
