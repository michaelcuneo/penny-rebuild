<script lang="ts">
	import { fade } from 'svelte/transition';
	import { enhance } from '$app/forms';
	import CircularProgress from '@smui/circular-progress';
	import mqtt from 'mqtt';
	import type { ISubscriptionGrant, MqttClient } from 'mqtt';
  import { browser } from '$app/environment';
	import { writable } from 'svelte/store';
  import { saving } from '$lib/stores';
	import type { PageData } from './$types';

	let dev = false;
  
	const BUTTON_1_TOPIC = 'home/penny4/arduino/buttons-board/button-1';
	const BUTTON_2_TOPIC = 'home/penny4/arduino/buttons-board/button-2';
	const BUTTON_3_TOPIC = 'home/penny4/arduino/buttons-board/button-3';
  
  let accepted: boolean;
  let currentUpload: Upload;
  let form: HTMLFormElement;
  let video: HTMLVideoElement;

	const createLike = async () => {
		saving.set(true);
		if (form) {
			form.requestSubmit();
		}
	}

  $: currentUpload = data?.data.uploads[Math.floor(Math.random() * data?.data.uploads.length)][0];
  $: accepted = false;
    
	const options = {
	  keepalive: 1,
	  clean: false,
	  connectTimeout: 4000,
	  clientId: 'penny-4-henge',
	}
  
	let client = writable<MqttClient | null>(null);

	if (browser) {
		let endpoint = dev ? 'ws://halide.michaelcuneo.com.au:8083' : 'ws://localhost:8083';
		$client = mqtt.connect(endpoint, options);

		$client.on('connect', () => {
			$client?.subscribe(BUTTON_1_TOPIC, (err: Error | null, granted?: ISubscriptionGrant[]) => {
				if (granted) {
					console.log('Granted:', granted);
				}
				if (!err) {
					console.log('Subscribed to ' + BUTTON_1_TOPIC);
				}
			});
		
			$client?.subscribe(BUTTON_2_TOPIC, (err: Error | null, granted?: ISubscriptionGrant[]) => {
				if (granted) {
					console.log('Granted:', granted);
				}
				if (!err) {
					console.log('Subscribed to ' + BUTTON_2_TOPIC);
				}
			});
		
			$client?.subscribe(BUTTON_3_TOPIC, (err: Error | null, granted?: ISubscriptionGrant[]) => {
				if (granted) {
					console.log('Granted:', granted);
				}
				if (!err) {
					console.log('Subscribed to ' + BUTTON_3_TOPIC);
				}
			});
	  });
  
		$client.on('message', (_topic, message) => {
      if (_topic === BUTTON_1_TOPIC && message.toString() === "1") {
				currentUpload = data?.data.uploads[Math.floor(Math.random() * data?.data.uploads.length)][0];
				if (currentUpload.uploadType === 'video/mp4' || currentUpload.uploadType === 'video/webm' || currentUpload.uploadType === 'video/ogg' || currentUpload.uploadType === 'video/quicktime') {
					video.play();
				}
      }
			if (_topic === BUTTON_2_TOPIC && message.toString() === "1") {
				currentUpload = data?.data.uploads[Math.floor(Math.random() * data?.data.uploads.length)][0];
			}
      if (_topic === BUTTON_3_TOPIC && message.toString() === "1") {
        createLike();
      };
		})
	};

	const useForm	= async () => {};

	setTimeout(() => {
		if (video)
			video.play();
	}, 1000);

	$: setInterval(async () => {
  	currentUpload = data?.data.uploads[Math.floor(Math.random() * data?.data.uploads.length)][0];
	}, 60000);
		
	export let data: PageData;
</script>

<div class="content poetsen-one-regular">
  {#if currentUpload.uploadType === 'video/mp4' || currentUpload.uploadType === 'video/webm' || currentUpload.uploadType === 'video/ogg' || currentUpload.uploadType === 'video/quicktime'}
    <video bind:this={video} src={currentUpload.media.url} width="100%" autoplay loop controls={false}>
      <track kind="captions" />
    </video>
  {:else if currentUpload.uploadType === 'image/png' || currentUpload.uploadType === 'image/jpeg' || currentUpload.uploadType === 'image/gif' || currentUpload.uploadType === 'image/webp'}
    <img src={currentUpload.media.url} alt={currentUpload.uploadType} width="100%" />
  {/if}
  <form bind:this={form} action="?/save" method="POST" use:enhance={useForm}>
    <input hidden name="currentUpload" bind:value={currentUpload.id} />
    <input hidden name="currentUploadLikes" bind:value={currentUpload.likes} />
  </form>
  <div class="like-text">{currentUpload.likes} LIKES</div>
</div>

{#if $saving === true}
  <div class="processing-overlay" transition:fade>
		<h4>
			'LIKE...'
		</h4>
    <CircularProgress style="height: 128px; width: 128px;" indeterminate />
  </div>
{/if}

<form bind:this={form} action="?/save" method="POST" use:enhance={useForm}>
	<input hidden name="uploadId" bind:value={currentUpload.id} />
</form>

<!--
<div class="question poetsen-one-regular">
  <div class="question-text" transition:fade>
		<h4>Coming Soon.</h4>
		<p>
			You can upload your own creative content or community notices to this Penny!
		</p>
		<p>Scan the uploads code to go to our website to upload content.</p>
		<h4>Copyright statement.</h4>
		<p>
			Copyright remains with the creator of the content, Penny is simply a platform for displaying content to share with the local community.
		</p>
		<h4>Scan 'Uploads' to upload content to this Penny.</h4>
		<h4>Scan 'Research Statement' to read about the research before participating.</h4>
  </div>
  <div class="qr-codes">
    <div class="row">
      <h4>Uploads</h4>
      <img src={uploadQr} alt="Uploads QR" />
    </div>
    <div class="row">
      <h4>Research Statement</h4>
      <img src={researchQr} alt="Research QR" />
    </div>
  </div>
</div>
-->

<style>
  .content {
    display: flex;
    color: white;
    font-size: 3.2rem;
    height: 100vh;
    justify-content: center;
    align-items: center;
  }
  .like-text {
		display: flex;
    position: absolute;
  	bottom: 4vh;
    left: 8vw;
    width: 30vw;
		align-items: center;
		justify-content: center;
		padding: 1rem;
		background-color: rgba(0, 0, 0, 0.5);
		border-radius: 1rem;
    font-size: 4.5rem;
  }
  .processing-overlay {
    position: fixed;
    display: flex;
		flex-direction: column;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
  }
	h4 {
		font-size: 3.2rem;
		letter-spacing: 5px;
		text-shadow:
			-1px -1px 0px #313639,
			2px 2px 0px #f489a355,
			4px 4px 0px #00000055;
	}
	/*
  .question {
		display: flex;
		flex-direction: column;
		align-items: center;
		color: white;
		width: 100vw;
		font-size: 3rem;
		height: 100vh;
	}
	.question-text {
		width: 90vw;
	}
	.qr-codes {
		display: flex;
		flex-direction: row;
		position: fixed;
		justify-content: space-around;
		width: 100vw;
		left: 0;
		bottom: 160px;
	}
	.row {
		display: flex;
		align-items: center;
		flex-direction: column;
	}
	img {
		width: 300px;
		height: 300px;
	}
	*/
</style>
