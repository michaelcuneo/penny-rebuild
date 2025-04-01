<script lang="ts">
	interface Props {
		children?: import('svelte').Snippet<[any]>;
	}

	let { children }: Props = $props();
	let hovering: boolean = $state(false);

	function enter() {
		hovering = true;
	}

	function leave() {
		hovering = false;
	}
</script>

<div onmouseenter={enter} onmouseleave={leave} role="presentation" aria-roledescription="hover">
	{@render children?.({ hovering, })}
</div>

<style>
	div {
		height: inherit;
		max-height: inherit;
	}
</style>
