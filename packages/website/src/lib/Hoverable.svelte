<script lang="ts">
	let hovering: boolean;

	function enter() {
		hovering = true;
	}

	function leave() {
		hovering = false;
	}
</script>

<div on:mouseenter={enter} on:mouseleave={leave} role="presentation" aria-roledescription="hover">
	<slot {hovering}></slot>
</div>

<style>
	div {
		height: inherit;
		max-height: inherit;
	}
</style>
