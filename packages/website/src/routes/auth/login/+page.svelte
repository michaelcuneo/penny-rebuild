<script lang="ts">
	import Button from '@smui/button';
	import Textfield from '@smui/textfield';
	import CircularProgress from '@smui/circular-progress';
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let dirty: boolean;
	let invalid: boolean;
	let focused: boolean;
	let value: string = '';
	let submitted = false;

	const onSubmit = () => {
		submitted = true;
	};

	$: !form?.success && setTimeout(() => { submitted = false }, 3000);
		

	$: disabled = focused || !value || !dirty || invalid;

	/** @type {import('./$types').ActionData} */
	export let form: ActionData;
</script>

{#if submitted && !form?.success}
	<div class="wrapper"><CircularProgress style="height: 32px; width: 32px;" indeterminate /></div>
{/if}
{#if !submitted && !form?.success}
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
				<Button variant="raised">Log in</Button>
			</p>
		</form>
	</div>
{:else if form?.success}
	<div class="wrapper">
		<h3>
			An email has been sent to {value}, click on the link in the email to sign in.
		</h3>
	</div>
{:else if !form?.success}
	<div class="wrapper">
		<h3>{form?.error}</h3>
	</div>
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
