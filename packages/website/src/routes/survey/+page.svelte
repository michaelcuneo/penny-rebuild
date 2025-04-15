<script lang="ts">
	import Select, { Option } from '@smui/select';
	import { enhance } from '$app/forms';
	import { fade } from 'svelte/transition';
	import SegmentedButton, { Segment, Label } from '@smui/segmented-button';
	import Textfield from '@smui/textfield';
	import Button from '@smui/button';
	import { questions } from '$lib/utils/Questions';

	let answers = $state([
		null,
		null,
		null,
		[],
		[],
		null,
		[],
		null,
		[],
		null,
		[],
		[],
	] as string[] | number[] | null[] | undefined[]);

	let strippedMultiselect = $state('');

	const stripStrings = () => {
		if ((answers[3] as string)?.length > 1) {
			strippedMultiselect = (answers[3] as unknown as string[])?.join(', ');
		} else {
			strippedMultiselect = answers[3]?.toString() || '';
		}
	}

	let disabled = $derived(answers.some((answer) => !answer));
</script>

<div class="page" in:fade>
	<form action="?/save" method="POST" use:enhance>
		<div class="questions">
			<div class="question">
				<h3>{questions[0].question}</h3>
				<Select variant="filled" bind:value={answers[0]}>
					{#each questions[0].options as option}
						<Option value={option}>{option}</Option>
					{/each}
				</Select>
			</div>
			<div class="question">
				<h3>{questions[1].question}</h3>
				<Select variant="filled" bind:value={answers[1]}>
					{#each questions[1].options as option}
						<Option value={option}>{option}</Option>
					{/each}
				</Select>
			</div>
			<div class="question">
				<h3>{questions[2].question}</h3>
				<h6>Under 16 Note: if you are under 16, please get a parent or guardian to help you complete the survey</h6>
				<Select variant="filled" bind:value={answers[2]}>
					{#each questions[2].options as option}
						<Option value={option}>{option}</Option>
					{/each}
				</Select>
			</div>
			<div class="question">
				<h3>{questions[3].question}</h3>
				<SegmentedButton on:change={stripStrings} segments={questions[3].options}  bind:selected={answers[3]}>
					{#snippet children({ segment }: { segment: string })}
						<Segment type="button" {segment}>
							<Label>{segment}</Label>
						</Segment>
					{/snippet}
				</SegmentedButton>
			</div>
			<div class="question">
				<h3>{questions[4].question}</h3>
				<SegmentedButton segments={questions[4].options}  singleSelect bind:selected={answers[4]}>
					{#snippet children({ segment }: { segment: string })}
						<Segment type="button" {segment}>
							<Label>{segment}</Label>
						</Segment>
					{/snippet}
				</SegmentedButton>
			</div>
			<div class="question">
				<h3>{questions[5].question}</h3>
				<Textfield variant="filled" bind:value={answers[5]} />
			</div>
			<div class="question">
				<h3>{questions[6].question}</h3>
				<SegmentedButton segments={questions[6].options}  singleSelect bind:selected={answers[6]}>
					{#snippet children({ segment }: { segment: string })}
						<Segment type="button" {segment}>
							<Label>{segment}</Label>
						</Segment>
					{/snippet}
				</SegmentedButton>
			</div>
			<div class="question">
				<h3>{questions[7].question}</h3>
				<Textfield variant="filled" bind:value={answers[7]} />
			</div>
			<div class="question">
				<h3>{questions[8].question}</h3>
				<SegmentedButton segments={questions[8].options}  singleSelect bind:selected={answers[8]}>
					{#snippet children({ segment }: { segment: string })}
						<Segment type="button" {segment}>
							<Label>{segment}</Label>
						</Segment>
					{/snippet}
				</SegmentedButton>
			</div>
			<div class="question">
				<h3>{questions[9].question}</h3>
				<Textfield variant="filled" bind:value={answers[9]} />
			</div>
			<div class="question">
				<h3>{questions[10].question}</h3>
				<SegmentedButton segments={questions[10].options}  singleSelect bind:selected={answers[10]}>
					{#snippet children({ segment }: { segment: string })}
						<Segment type="button" {segment}>
							<Label>{segment}</Label>
						</Segment>
					{/snippet}
				</SegmentedButton>
			</div>
			<div class="question">
				<h3>{questions[11].question}</h3>
				<input type="color" />
			</div>
			<input hidden name="q1" value={answers[0]} />
			<input hidden name="q2" value={answers[1]} />
			<input hidden name="q3" value={answers[2]} />
			<input hidden name="q4" value={strippedMultiselect} />
			<input hidden name="q5" value={answers[4]} />
			<input hidden name="q6" value={answers[5]} />
			<input hidden name="q7" value={answers[6]} />
			<input hidden name="q8" value={answers[7]} />
			<input hidden name="q9" value={answers[8]} />
			<input hidden name="q10" value={answers[9]} />
			<input hidden name="q11" value={answers[10]} />
			<div style="display: flex; justify-content: flex-end;">
				<Button variant="raised">Clear Values</Button>
				<Button variant="raised" disabled={disabled} onsubmit={() => (disabled = true)}>Submit</Button>
			</div>
		</div>
	</form>
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
		width: 70vw;
		color: #f489a3;
		padding: 2rem;
		font-size: 1.6rem;
	}
	.question {
		display: flex;
		flex-direction: column;
		width: 100%;
	}
	h3 {
		margin-bottom: 1rem;
		line-height: 1.4rem;
	}
	@media screen and (max-width: 1224px) {
		.questions {
			width: 96vw;
		}
	}
</style>
