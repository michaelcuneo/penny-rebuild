<script lang="ts">
	import CircularProgress from '@smui/circular-progress';
	import { enhance } from '$app/forms';
	import { fade } from 'svelte/transition';
	import Textfield from '@smui/textfield';
	import Button from '@smui/button';
	import upload from '$lib/upload.svg';
	import FilePond, { registerPlugin } from 'svelte-filepond';
	import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
	import FilePondPluginImagePreview from 'filepond-plugin-image-preview';

	let firstName: string = '';
	let lastName: string = '';
	let email: string = '';
	let fileId: string = '';
	let fileType: string = '';
	let formSubmitDisabled: boolean;
	let fileSubmitDisabled: boolean;
	let saving: boolean = false;
	let submissionStarted: boolean = false;
	let uploadingFile: boolean = false;
	let formFilled: boolean = false;

	const reset = () => {
		firstName = '';
		lastName = '';
		email = '';
		fileId = '';
		fileType = '';
		saving = false;
		submissionStarted = false;
		uploadingFile = false;
		formFilled = false;
		formSubmitDisabled = false;
		fileSubmitDisabled = false;

		pond.removeFiles();
	};

	registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

	let pond: FilePond;

	const handleInit = () => {
		fileId = data.id;
	};

	const handleAddFile = async (err: string, fileItem: any) => {
		saving = true;

		const file = fileItem.file as File;

		const myRenamedFile = new File([file], fileId);

		const upload = await fetch (data.url, {
			method: 'PUT',
			body: myRenamedFile,
			headers: {
				'Content-Type': myRenamedFile.type,
				'Content-Disposition': `attachment; filename=${myRenamedFile.name}`
			}
		})

		if (upload.ok) {
			fileType = fileItem.file.type;
			saving = false;
			return;
		}

		if (err) {
			return;
		}
	};

  const useForm = () => {
		uploadingFile = true;
    return async ({ result, update }: any) => {
      if (result.type === 'success') {
				setTimeout(() => {
					reset();
				}, 10000);
      }
      update();
    };
  }

	$: formSubmitDisabled = email === '';
	$: fileSubmitDisabled = fileType === '' || fileId === '';
	export let data;
</script>

<div class="page" in:fade>
	{#if !submissionStarted}
	<div class="upload">
		<img class="upload-image" src={upload} alt="Penny Logo" />
		<div style="display: flex; justify-content: center;">
			<Button variant="raised" on:click={() => submissionStarted = true}>START SUBMISSION</Button>
		</div>
		<h2>Disclaimer</h2>
		<span>Once you submit your content to Penny it will be reviewed and if approved you will be notified when it is published on Penny.</span>
		<span>The best format for your content is portrait orientation and <span style="font-weight: bold;">1920 (height) x 1080 (width) pixels.</span></span>
		<span>Maximum duration of video or sound based works is <span style="font-weight: bold;">1 minute length.</span></span>
		<span style="font-weight: bold; font-style: italic;">Copyright remains with the creator of the content, Penny is simply a platform for displaying content to share with the local community.</span>
		</div>	
	{:else if !formFilled}
		<div class="upload">
			<h1>Fill in your details</h1>
			<div class="field">
				<Textfield
					input$name="firstName"
					input$id="firstName"
					variant="outlined"
					style="width: 100%;"
					helperLine$style="width: 100%;"
					bind:value={firstName}
					label="First Name"
				/>
				<Textfield
					input$name="lastName"
					input$id="lastName"
					variant="outlined"
					style="width: 100%;"
					helperLine$style="width: 100%;"
					bind:value={lastName}
					label="Last Name"
				/>
			</div>
			<Textfield
				input$name="email"
				input$id="email"
				variant="outlined"
				style="width: 100%;"
				required
				helperLine$style="width: 100%;"
				bind:value={email}
				label="Email"
			/>
			<span>You must include at least your email to submit a contribution to the Pennys.</span>
			<div style="display: flex; justify-content: flex-end;">
				<Button variant="raised" on:click={reset}>Cancel Submission</Button>
				<Button variant="raised" disabled={formSubmitDisabled} on:click={() => formFilled = true}>Next</Button>
			</div>
		</div>
	{:else if !uploadingFile}
		<div class="upload">
			<h1>Upload your file</h1>
			<form action="?/save" method="POST" use:enhance={useForm}>
				<div class="filepond">
					<FilePond
						bind:this={pond}
						acceptedFileTypes={['image/*', 'video/*', 'audio/*']}
						allowMultiple={false}
						oninit={handleInit}
						onaddfile={handleAddFile}
					/>
				</div>
				<input type="hidden" name="fileId" bind:value={fileId} />
				<input type="hidden" name="fileType" bind:value={fileType} />
				<input type="hidden" name="firstName" bind:value={firstName} />
				<input type="hidden" name="lastName" bind:value={lastName} />
				<input type="hidden" name="email" bind:value={email} />
				<span>Accepted file types: image, video, audio</span>
				<div style="display: flex; justify-content: flex-end;">
					<Button variant="raised" on:click={reset}>Cancel Submission</Button>
					<Button variant="raised" disabled={fileSubmitDisabled}>Submit</Button
					>
				</div>
			</form>
		</div>
	{:else}
		<div class="upload">
			<h1>Thank you for your submission</h1>
			<span>Your content has been submitted and is now under review.</span>
			<span>You will be notified when your content is published on Penny.</span>
			<span>You will be redirected to the upload page in 10 seconds.</span>
			<div style="display: flex; justify-content: flex-end;">
				<Button variant="raised" on:click={reset}>Submit Another</Button>
			</div>
		</div>
	{/if}
</div>

{#if saving === true}
  <div class="processing-overlay" transition:fade>
		<h4>
			'Saving...'
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
		min-height: calc(100vh - 309px);
		align-items: flex-start;
	}
	.upload {
		display: flex;
		flex-direction: column;
		width: 800px;
		color: #f489a3;
		padding: 2rem;
		font-size: 1.6rem;
	}
	.upload-image {
		height: 60vh;
	}
	.field {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		margin-bottom: 1rem;
	}
	.filepond {
		width: 100%;
		padding: 1rem 0rem;
	}
	span {
		padding: 0.2rem 0rem;
		font-size: 0.9rem;
	}
	@media screen and (max-width: 1224px) {
		.upload {
			width: 96vw;
		}
	}
</style>
