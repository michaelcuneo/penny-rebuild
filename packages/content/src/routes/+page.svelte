<script lang="ts">
	import { enhance } from '$app/forms';
	import { fade } from 'svelte/transition';
	import mqtt from 'mqtt';
	import type { ISubscriptionGrant, MqttClient } from 'mqtt';
  import { browser } from '$app/environment';
	import { writable } from 'svelte/store';
  import { saving } from '$lib/stores';
	import CircularProgress from '@smui/circular-progress';
	import type { PageData } from './$types';
  import type { SubmitFunction } from '@sveltejs/kit';
  
	const BUTTON_1_TOPIC = 'home/penny4/arduino/buttons-board/button-1';
	const BUTTON_2_TOPIC = 'home/penny4/arduino/buttons-board/button-2';
	const BUTTON_3_TOPIC = 'home/penny4/arduino/buttons-board/button-3';
  
  let currentUpload: Upload;
  let form: HTMLFormElement;
  let video: HTMLVideoElement;

  $: currentUpload = data?.data.uploads[Math.floor(Math.random() * data?.data.uploads.length)][0];
    
	const options = {
	  keepalive: 1,
	  clean: false,
	  connectTimeout: 4000,
	  clientId: 'penny-4-henge',
	}
  
	let client = writable<MqttClient | null>(null);

	const createLike = async () => {
		saving.set(true);
		form.requestSubmit();
	}

	if (browser) {
	  $client = mqtt.connect('ws://halide.michaelcuneo.com.au:8083', options);
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
        video.play();
      }
			if (_topic === BUTTON_2_TOPIC && message.toString() === "1") {
        video.play();
			}
      if (_topic === BUTTON_3_TOPIC && message.toString() === "1") {
        createLike();
      };
		})
	};

  const useForm: SubmitFunction = ({ formData, formElement, action, controller, submitter}) => {
    return async ({ result }) => {
			if (result.type === 'error') {
				saving.set(false);
			}
      if (result.type === 'success') {
        saving.set(false);
      }
    };
  }
		
	export let data: PageData;
</script>
  
<div class="content poetsen-one-regular">
  {#if currentUpload.uploadType === 'video/mp4' || currentUpload.uploadType === 'video/webm' || currentUpload.uploadType === 'video/ogg' || currentUpload.uploadType === 'video/quicktime'}
    <video bind:this={video} src="https://{data.data.bucket}.s3.ap-southeast-2.amazonaws.com/{currentUpload?.uploadId}" width="100%">
      <track kind="captions" />
    </video>
  {:else if currentUpload.uploadType === 'image/png' || currentUpload.uploadType === 'image/jpeg' || currentUpload.uploadType === 'image/gif' || currentUpload.uploadType === 'image/webp'}
    <img src="https://{data.data.bucket}.s3.ap-southeast-2.amazonaws.com/{currentUpload?.uploadId}" alt={currentUpload.uploadType} width="320" />
  {/if}
  <form bind:this={form} action="?/save" method="POST" use:enhance>
    <input hidden name="currentUpload" bind:value={currentUpload.id} />
    <input hidden name="currentUploadLikes" bind:value={currentUpload.likes} />
  </form>
  <div class="like-text">{currentUpload.likes} likes.</div>
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
	<input hidden name="contentId" bind:value={currentUpload.id} />
</form>

<!-- Fix these colors to match the colors of the henge buttons -->
<!-- Swap these button functionalities for what area of the page the user is on -->
<!--
<div class="instructions">
  <div class="instruction instruction1 poetsen-one-regular">MUSIC</div>
  <div class="instruction instruction2 poetsen-one-regular">VIDEO</div>
  <div class="instruction instruction3 poetsen-one-regular">LIKE</div>
</div>
-->

<style>
  .content {
    display: flex;
    color: #f489a3;
    font-size: 3.2rem;
    height: 100vh;
    justify-content: center;
    align-items: center;
  }
  .like-text {
    position: absolute;
  	bottom: 6vh;
    left: 8vw;
    width: 60vw;
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
  /*
  .instructions {
    position: fixed;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    width: 100vw;
    bottom: 0;
  }
  .instruction {
    display: flex;
    align-items: center;
    justify-content: center;
		font-size: 2rem;
    color: white;
    width: 180px;
    height: 90px;
    border-top-left-radius: 90px;
    border-top-right-radius: 90px;
    background-color: #f489a3;
  }
  .instruction1 {
    background-color: #e62d6b;
  }
  .instruction2 {
    background-color: #4d28ee;
  }
  .instruction3 {
    background-color: #108d40;
  }
  */
</style>
