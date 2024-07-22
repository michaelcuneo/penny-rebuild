<script lang="ts">
	import CircularProgress from '@smui/circular-progress';
	import { enhance } from '$app/forms';
	import { fade } from 'svelte/transition';
	import Textfield from '@smui/textfield';
	import Button from '@smui/button';

	let code = '';
  let downloading = false;

	const reset = () => {
		code = '';
	};

	$: submitDisabled = code.length < 6 || code.length === 0;

  const useForm = () => {
    return async ({ result, update, formElement, action, controller, submitter }: any) => {
      if (result.type === 'success') {
        reset();
        downloading = false;
      }
      update();
    };
  }

	export let form;
</script>

<div class="page" in:fade>
	<div class="questions">
		<h1>Download your Flipdot Animation</h1>
		<form action="?/get" method="POST" use:enhance={useForm}>
      <Textfield
        input$name="code"
        input$id="code"
        input$maxlength={6}
        variant="outlined"
        style="width: 100%;"
        helperLine$style="width: 100%;"
        bind:value={code}
        label="6 Digit Code"
      />
			<div style="display: flex; justify-content: flex-end;">
				<Button variant="raised" disabled={submitDisabled} on:submit={() => (downloading = true)}
					>Submit</Button
				>
			</div>
		</form>
    {#if form?.success}
      <div class="success" transition:fade>
        <h3>Success!</h3>
        <p>Your animation has been downloaded.</p>
        <img src={form.url} alt={form.url} />
        <h2>Share your animation on the socials</h2>
        <span style="font-weight: bold; font-style: italic;">Copyright remains with the creator of the content, Penny is simply a platform for displaying content to share with the local community.</span>    
      </div>
    {/if}
    {#if form?.success === false}
      <div class="error" transition:fade>
        <h3>Error!</h3>
        <p>{form?.error}</p>
      </div>
    {/if}
	</div>
</div>

{#if downloading === true}
  <div class="processing-overlay" transition:fade>
		<h4>
			'Downloading...'
		</h4>
    <CircularProgress style="height: 64px; width: 64px;" indeterminate />
  </div>
{/if}

<style>
	.page {
		display: flex;
		flex-wrap: wrap;
		flex-direction: row;
		justify-content: center;
		align-items: flex-start;
	}
	.questions {
		display: flex;
		flex-direction: column;
		width: 1000px;
		color: #f489a3;
		padding: 2rem;
		font-size: 1.6rem;
	}
	span {
		padding: 0.2rem 0rem;
		font-size: 0.9rem;
	}
	@media screen and (max-width: 1224px) {
		.questions {
			width: 96vw;
		}
	}
</style>
