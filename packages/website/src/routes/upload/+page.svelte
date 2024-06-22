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

	let firstName = '';
	let lastName = '';
	let email = '';
	let fileId = '';
	let fileType = '';
	let saving = false;

	const reset = () => {
		firstName = '';
		lastName = '';
		email = '';
		pond.removeFiles();
	};

	registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

	$: fileDisabled = !firstName || !lastName || !email;
	$: submitDisabled = true;

	let pond: FilePond;

	const handleInit = () => {
		fileId = data.id;
	};

	const handleAddFile = async (err: string, fileItem: any) => {
		saving = true;
		const file = fileItem.file as File;
		const upload = await fetch (data.url, {
			method: 'PUT',
			body: file,
			headers: {
				'Content-Type': file.type,
				'Content-Disposition': `attachment; filename=${file.name}`
			}
		})

		if (upload.ok) {
			fileType = fileItem.file.type;
			submitDisabled = false;
			saving = false;
			return;
		}

		if (err) {
			return;
		}
	};

  const useForm = () => {
    return async ({ result, update }) => {
      if (result.type === 'success') {
        reset();
        saving = false;
      }
      update();
    };
  }

	export let data;
</script>

<div class="page" in:fade>
	<img class="upload-image" src={upload} alt="Penny Logo" />
	<div class="questions">
		<h1>Upload Content to Penny</h1>
		<form action="?/save" method="POST" use:enhance={useForm}>
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
				helperLine$style="width: 100%;"
				bind:value={email}
				label="Email"
			/>
			<input type="hidden" name="fileId" bind:value={fileId} />
			<input type="hidden" name="fileType" bind:value={fileType} />
			<div class="filepond">
				<FilePond
					bind:this={pond}
					acceptedFileTypes={['image/*', 'video/*', 'audio/*']}
					disabled={fileDisabled}
					allowMultiple={false}
					oninit={handleInit}
					onaddfile={handleAddFile}
				/>
			</div>
			<div style="display: flex; justify-content: flex-end;">
				<Button variant="raised" on:click={reset}>Clear Values</Button>
				<Button variant="raised" disabled={submitDisabled} on:submit={() => (saving = true)}
					>Submit</Button
				>
			</div>
		</form>
		<h2>Disclaimer</h2>
		<span>Once you submit your content to Penny it will be reviewed and if approved you will be notified when it is published on Penny.</span>
		<span>The best format for your content is portrait orientation and <span style="font-weight: bold;">1920 (height) x 1080 (width) pixels.</span></span>
		<span>Maximum duration of video or sound based works is <span style="font-weight: bold;">1 minute length.</span></span>
		<span style="font-weight: bold; font-style: italic;">Copyright remains with the creator of the content, Penny is simply a platform for displaying content to share with the local community.</span>
	</div>
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
	.upload-image {
		height: 100vh;
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
		.questions {
			width: 96vw;
		}
	}
</style>
