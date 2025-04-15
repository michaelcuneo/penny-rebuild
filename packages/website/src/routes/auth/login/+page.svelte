<script lang="ts">
	import { run } from 'svelte/legacy';

	import Button from '@smui/button';
	import Textfield from '@smui/textfield';
	import CircularProgress from '@smui/circular-progress';
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let dirty: boolean = $state(false);
	let invalid: boolean = $state(false);
	let focused: boolean = $state(false);
	let value: string = $state('');
	let submitted = $state(false);
	let disabled = $state(true);

	const onSubmit = () => {
		submitted = true;
	};

	interface Props {
		/** @type {import('./$types').ActionData} */
		form: ActionData;
	}

	let { form }: Props = $props();
	run(() => {
		!form?.success &&
			setTimeout(() => {
				dirty = false;
				invalid = false;
				focused = false;
				submitted = false;
			}, 5000);
	});
</script>

<div class="wrapper">
	<form class="form" method="POST" action="?/magicLinks" use:enhance={onSubmit}>
		<h4>LOGIN WITH EMAIL</h4>
		<p>
			<Textfield
				type="email"
				bind:dirty
				bind:invalid
				updateInvalid
				bind:value
				variant="filled"
				label="email"
				input$name="email"
				input$autocomplete="email"
				on:focus={() => (focused = true)}
				on:blur={() => (focused = false)}
				withTrailingIcon={!disabled}
			/>
		</p>
		<p>
			<Button variant="raised" {disabled}>Log in</Button>
		</p>
	</form>
</div>
{#if form?.success}
	<div class="wrapper">
		<h3>
			An email has been sent to {value}, click on the link in the email to sign in.
		</h3>
	</div>
{/if}
{#if form?.error}
	<div class="wrapper">
		<h3>{form?.error}</h3>
	</div>
{/if}
{#if submitted}
	<div class="wrapper"><CircularProgress style="height: 32px; width: 32px;" indeterminate /></div>
{/if}

<style>
	.wrapper {
		display: flex;
		position: relative;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 3rem 0 3rem 0;
	}
	.form {
		display: flex;
		flex-direction: column;
		width: 300px;
		background: var(--surface-color);
		padding: 0.8rem;
		margin: 0.8rem;
		border-radius: 10px;
	}
	p {
		display: flex;
		flex-direction: column;
		width: 100%;
	}
	h4 {
		line-height: 0.4rem;
	}
	@media screen and (max-width: 1200px) {
		.wrapper {
			padding: 1rem;
		}
	}
</style>
