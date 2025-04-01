<script lang="ts">
	import { fade } from 'svelte/transition';
	import { enhance } from '$app/forms';
	import LayoutGrid, { Cell } from '@smui/layout-grid';
	import Textfield from '@smui/textfield';
	import Icon from '@smui/textfield/icon';
	import HelperText from '@smui/textfield/helper-text';
	import Button from '@smui/button';

	let firstName: string = $state('');
	let lastName: string = $state('');
	let email: string = $state('');
	let message: string = $state('');
</script>

<div class="contact" in:fade>
	<LayoutGrid>
		<Cell span={4}>
			<div class="container">
				<h2>FASTlab</h2>
				<h3>Building Q</h3>
				<h3>The University of Newcastle</h3>
			</div>
		</Cell>
		<Cell span={8}>
			<div class="container">
				<h2>Contact FASTlab</h2>
				<form method="POST" use:enhance>
					<Textfield
						variant="outlined"
						input$name="firstName"
						bind:value={firstName}
						label="Given Name"
					>
						{#snippet leadingIcon()}
												<Icon class="material-icons" >person</Icon>
											{/snippet}
						{#snippet helper()}
												<HelperText >Given Name</HelperText>
											{/snippet}
					</Textfield>
					<Textfield variant="outlined" input$name="lastName" bind:value={lastName} label="Surname">
						{#snippet leadingIcon()}
												<Icon class="material-icons" >person</Icon>
											{/snippet}
						{#snippet helper()}
												<HelperText >Surname</HelperText>
											{/snippet}
					</Textfield>
					<Textfield variant="outlined" input$name="email" bind:value={email} label="Email Address">
						{#snippet leadingIcon()}
												<Icon class="material-icons" >email</Icon>
											{/snippet}
						{#snippet helper()}
												<HelperText >Contact Email</HelperText>
											{/snippet}
					</Textfield>
					<Textfield
						textarea
						variant="outlined"
						input$name="message"
						bind:value={message}
						label="Message"
						required
					>
						{#snippet helper()}
												<HelperText >Enquiry</HelperText>
											{/snippet}
					</Textfield>
					<Button variant="raised">Submit</Button>
				</form>
			</div>
		</Cell>
	</LayoutGrid>
</div>

<style>
	.contact {
		display: flex;
		flex-direction: column;
		width: 100vw;
	}
	.container {
		color: var(--on-surface-color);
		background-color: var(--surface-color);
		padding: 1.8rem;
		border-radius: 10px;
	}
	form {
		display: flex;
		flex-direction: column;
	}
	h2 {
		color: var(--on-surface-color);
	}
	@media screen and (max-width: 1200px) {
		.contact {
			padding: 1rem;
		}
		.container {
			margin: 1rem;
		}
	}
</style>
