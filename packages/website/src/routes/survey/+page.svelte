<script lang="ts">
	import { fade } from 'svelte/transition';
	import Formfield from '@smui/form-field';
	import Textfield from '@smui/textfield';
	import Button from '@smui/button';
	import { questions } from '$lib/Questions';

	let answers: Answer[] = [
		{
			id: 1,
			answer: ''
		},
		{
			id: 2,
			answer: ''
		},
		{
			id: 3,
			answer: ''
		},
		{
			id: 4,
			answer: ''
		},
		{
			id: 4,
			answer: ''
		},
		{
			id: 5,
			answer: ''
		},
		{
			id: 6,
			answer: ''
		},
		{
			id: 7,
			answer: ''
		},
		{
			id: 8,
			answer: ''
		},
		{
			id: 9,
			answer: ''
		},
		{
			id: 10,
			answer: ''
		},
		{
			id: 11,
			answer: ''
		}
	];
</script>

<div class="page" in:fade>
	<div class="questions">
		{#each questions as question}
			<Formfield>
				<div class="question">
				<Textfield
					input$name={question.id}
					input$id={question.id}
					variant="outlined"
					style="width: 100%;"
					helperLine$style="width: 100%;"
					bind:value={answers[question.number].answer}
					label={question.question}
				/>
				</div>
			</Formfield>
		{/each}
		<div style="display: flex; justify-content: flex-end;">
			<Button variant="raised">Clear Values</Button>
			<Button variant="raised">Submit</Button>
		</div>
	</div>
</div>

<style>
  .page {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.questions {
		display: flex;
		flex-direction: column;
		width: 1000px;
		color: #f489a3;
		padding: 2rem;
		font-size: 1.6rem;
	}
	.question {
		width: 100%;
		margin-bottom: 1rem;
	}
	@media screen and (max-width: 1224px) {
		.questions {
			width: 96vw;
		}
	}
</style>
