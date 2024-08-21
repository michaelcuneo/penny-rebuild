<script lang="ts">
	import { enhance } from '$app/forms';
	import { fade } from 'svelte/transition';
	import Typewriter from 'svelte-typewriter';
	import Penny from '$lib/Penny.svg';
	import { postcards } from '$lib/Postcards';
	import mqtt from 'mqtt';
	import type { ISubscriptionGrant, MqttClient } from 'mqtt';
  import { browser } from '$app/environment';
	import { writable } from 'svelte/store';
	import { processing, recording, saving } from '$lib/stores';
	import CircularProgress from '@smui/circular-progress';
	import type { SubmitFunction } from '@sveltejs/kit';
  
	let dev = false;
	
	const BUTTON_1_TOPIC = 'home/penny3/arduino/buttons-board/button-1';
	const BUTTON_2_TOPIC = 'home/penny3/arduino/buttons-board/button-2';
	const BUTTON_3_TOPIC = 'home/penny3/arduino/buttons-board/button-3';
	const MOSQUITTO_RECORDING_TOPIC = 'home/penny3/record';
  
	let form: HTMLFormElement;
  let whisperResponse: string = '';
  let currentPostcard: Postcard = postcards[Math.floor(Math.random() * postcards.length)];
	let timeLeft: number;
	let timeLeftInterval: NodeJS.Timeout;

	$: timeLeft = 3;
	$: whisperResponse = '';

	const reset = () => {
		currentPostcard = postcards[Math.floor(Math.random() * postcards.length)];
		recording.set(false);
		processing.set(false);
		whisperResponse = '';
	}

	const options = {
	  keepalive: 1,
	  clean: false,
	  connectTimeout: 4000,
	  clientId: 'penny-3-henge',
	}
  
	let client = writable<MqttClient | null>(null);

	const createResponse = async () => {
		saving.set(true);
		if (form) {
			form.requestSubmit();
		}
		
		new Promise((resolve) => setTimeout(resolve, 10000)).then(() => reset());
	}

	const startProcessing = async () => {
		processing.set(true);
		clearInterval(timeLeftInterval);
		timeLeft = 3;
				
		await fetch('http://localhost:8000/transcribe', {
			headers: {
				'no-cors': 'true',
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Access-Control-Allow-Origin': '*'
			}
		})
			.then((res) => res.json())
			.then(data => {

				whisperResponse = data;
				processing.set(false);
			
			})
	}

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

			$client?.subscribe(MOSQUITTO_RECORDING_TOPIC, (err: Error | null, granted?: ISubscriptionGrant[]) => {
				if (granted) {
					console.log('Granted:', granted);
				}
				if (!err) {
					console.log('Subscribed to ' + MOSQUITTO_RECORDING_TOPIC);
				}
			})
	  });
  
		$client.on('message', (_topic, message) => {
			if (_topic === BUTTON_1_TOPIC && message.toString() === "1") {

				// Reset the postcard and the recording state.
				reset();

			} else
			if (_topic === BUTTON_2_TOPIC && message.toString() === "1") {

				if (!$recording && !$processing) {

					// Set 3 second delay
					timeLeftInterval = setInterval(() => {
						if (timeLeft > 0) {
							
							timeLeft--;

						}
					}, 1000);

					setTimeout(() => {
						$client?.publish(MOSQUITTO_RECORDING_TOPIC, 'START', { qos: 0, retain: false });
					}, 3000);

					// Set recording to true because 3 seconds have passed, we are now recording.
					recording.set(true);

				}
		
			} else if (_topic === BUTTON_2_TOPIC && message.toString() === "0") {

				if ($recording && !$processing) {

					$client?.publish(MOSQUITTO_RECORDING_TOPIC, 'STOP', { qos: 0, retain: false });
					recording.set(false);

					startProcessing();
				}

			} else if (_topic === BUTTON_3_TOPIC && message.toString() === "1") {
				if (whisperResponse === '') {

					recording.set(false);
					processing.set(false);
					whisperResponse = 'Please record an answer first.';

					new Promise(resolve => setTimeout(resolve, 10000))
						.then(() => whisperResponse = '');

				} else {

					createResponse();

				}
			}
		})
	};

  const useForm: SubmitFunction = () => {
    return async ({ result }) => {
			if (result.type === 'error') {
				whisperResponse = '';
				saving.set(false);
			}
      if (result.type === 'success') {
        whisperResponse = '';
        saving.set(false);
      }
    };
  }	
</script>

{#if $saving}
	<div class="question poetsen-one-regular">
		<div class="question-text" transition:fade>
			<h5>
				Postcard Submitted!
			</h5>
			<div>
				Thank you for submitting a postcard.
			</div>
		</div>
	</div>
{:else}
	<div class="postcard poetsen-one-regular" style="background-image: url({Penny})">
		<div class="postcard-text" transition:fade>
			<Typewriter cursor={false}>
				{currentPostcard.postCard}
			</Typewriter>
				{#if $recording === false && $processing === false && whisperResponse}
					{whisperResponse}
				{/if}
		</div>
	</div>
{/if}
{#if $recording === true || $processing === true}
	<div class="processing-overlay" transition:fade>
		<h2>
			{#if $recording}
				{#if timeLeft === 0}
					Recording...
				{:else}
					Recording in {timeLeft}
				{/if}
			{:else if $processing}
				Transcribing...
			{/if}
		</h2>
		<CircularProgress style="height: 128px; width: 128px;" indeterminate />
	</div>
{/if}

<form bind:this={form} action="?/save" method="POST" use:enhance={useForm}>
	<input hidden name="postcardId" bind:value={currentPostcard.id} />
	<input hidden name="response" bind:value={whisperResponse} />
</form>

<style>
  .postcard {
    display: flex;
    color: white;
    font-size: 3.2rem;
    max-height: 100vh;
    justify-content: center;
    align-items: center;
    background-repeat: no-repeat;
    background-position: right;
    background-size: contain;
		letter-spacing: 5px;
		text-shadow:
			-1px -1px 0px #313639,
			2px 2px 0px #f489a355,
			4px 4px 0px #00000055;
  }
	h5 {
		font-size: 4.6rem;
		letter-spacing: 5px;
		text-shadow:
			-1px -1px 0px #313639,
			2px 2px 0px #f489a355,
			4px 4px 0px #00000055;
	}
  .postcard-text {
    position: absolute;
  	top: 6vh;
    left: 8vw;
    width: 60vw;
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
    background-color: rgba(0, 0, 0, 0.9);
  }
</style>
