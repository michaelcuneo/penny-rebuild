<script lang="ts">
	import { fade } from 'svelte/transition';
	import mqtt from 'mqtt';
	import type { ISubscriptionGrant, MqttClient } from 'mqtt';
  import { browser } from '$app/environment';
	import { writable } from 'svelte/store';
  import { saving } from '$lib/stores';
  import Typewriter from 'svelte-typewriter';
  import researchQr from '$lib/research-code.png';
	import surveyQr from '$lib/survey-code.png';
  import uploadQr from '$lib/upload-code.png';
	import type { PageData } from './$types';
  import type { SubmitFunction } from '@sveltejs/kit';
  
	const BUTTON_1_TOPIC = 'home/penny4/arduino/buttons-board/button-1';
	const BUTTON_2_TOPIC = 'home/penny4/arduino/buttons-board/button-2';
	const BUTTON_3_TOPIC = 'home/penny4/arduino/buttons-board/button-3';
  
  let accepted: boolean;
  let currentUpload: Upload;
  let form: HTMLFormElement;
  let video: HTMLVideoElement;

  $: currentUpload = data?.data.uploads[Math.floor(Math.random() * data?.data.uploads.length)][0];
  $: accepted = false;
    
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

  const useForm: SubmitFunction = () => {
    return async ({ result }) => {
			if (result.type === 'error') {
			}
      if (result.type === 'success') {
      }
    };
  }
		
	export let data: PageData;
</script>

<!--
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
-->

<div class="question poetsen-one-regular">
  <div class="question-text" transition:fade>
    <Typewriter cursor={false} mode="cascade">
      <h4>Coming Soon.</h4>
      <p>
        You can upload your own creative content or community notices to this Penny!
      </p>
      <p>Go to this website to fill out the form</p>
      <h4>Privacy statement.</h4>
      <p>
        All responses are anonymous. Voice recordings will be automatically converted to text and
        the audio will not be stored.
      </p>
      <h4>Scan 'Uploads' to upload content to this Penny.</h4>
      <h4>Scan 'Research Statement' to read about the research before participating.</h4>
      <h4>Scan 'Private Survey' to participate in the survey online.</h4>
      <h4>
        To participate in this survey, proceed by hitting the tick.
      </h4>
    </Typewriter>
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
    <div class="row">
      <h4>Private Survey</h4>
      <img src={surveyQr} alt="Survey QR" />
    </div>
  </div>
</div>


<style>
  /*
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
  */
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
</style>
