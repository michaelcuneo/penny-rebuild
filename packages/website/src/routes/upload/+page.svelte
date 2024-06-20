<script lang="ts">
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
	let uploading = false;
	let thanks = false;

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
		// console.log('FilePond has initialised', pond);
	};

	const handleAddFile = async (err: string, fileItem: any) => {
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
			return;
		}

		if (err) {
			return;
		}
	};

	$: form?.success && setTimeout(() => {
		thanks = true,
		uploading = false,
		reset();
	}, 2000);

	export let data, form;
</script>

{#if !thanks}
<div class="page" in:fade>
	<img class="upload-image" src={upload} alt="Penny Logo" />
	<div class="questions">
		<h1>Upload Content to Penny</h1>
		<form action="?/save" method="POST" use:enhance>
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
					disabled={fileDisabled}
					allowMultiple={false}
					oninit={handleInit}
					onaddfile={handleAddFile}
				/>
			</div>
			<div style="display: flex; justify-content: flex-end;">
				<Button variant="raised" on:click={reset}>Clear Values</Button>
				<Button variant="raised" disabled={submitDisabled} on:submit={() => (uploading = true)}
					>Submit</Button
				>
			</div>
		</form>
	</div>
</div>
{:else if uploading}
	<div class="page" in:fade>
		<h1>Uploading...</h1>
	</div>
{:else}
	<div class="page" in:fade>
		<h1>Thanks for your submission! We will take a look and see if we can add it to the Pennies</h1>
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
	@media screen and (max-width: 1224px) {
		.questions {
			width: 96vw;
		}
	}
</style>
