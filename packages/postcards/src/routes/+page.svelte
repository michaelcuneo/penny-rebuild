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
  
	const BUTTON_1_TOPIC = 'home/penny3/arduino/buttons-board/button-1';
	const BUTTON_2_TOPIC = 'home/penny3/arduino/buttons-board/button-2';
	const BUTTON_3_TOPIC = 'home/penny3/arduino/buttons-board/button-3';
	const MOSQUITTO_RECORDING_TOPIC = 'home/penny3/record';
  
	let form: HTMLFormElement;
  let whisperResponse: string = '';
  let currentPostcard: Postcard = postcards[Math.floor(Math.random() * postcards.length)];
    
	const options = {
	  keepalive: 1,
	  clean: false,
	  connectTimeout: 4000,
	  clientId: 'penny-3-henge',
	}
  
	let client = writable<MqttClient | null>(null);

	const createResponse = async () => {
		saving.set(true);
		form.requestSubmit();
	}

	const startProcessing = async () => {
		processing.set(true);
				
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
	  $client = mqtt.connect('ws://localhost:8083', options);
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
			console.log('Topic: ' + _topic + ' Message: ' + message.toString());
			if (_topic === BUTTON_2_TOPIC && message.toString() === "1") {

				recording.set(true);
				processing.set(false);

				setTimeout(() => {
					$client?.publish(MOSQUITTO_RECORDING_TOPIC, 'START', { qos: 0, retain: false });					
				}, 3000);
			
			} else if (_topic === BUTTON_2_TOPIC && message.toString() === "0") {

				recording.set(false);
				processing.set(false);

				$client?.publish(MOSQUITTO_RECORDING_TOPIC, 'STOP', { qos: 0, retain: false });

				startProcessing();

			} else if (_topic === BUTTON_3_TOPIC && message.toString() === "1") {
				if (whisperResponse === '') {

					recording.set(false);
					processing.set(false);
					
					currentPostcard = postcards[Math.floor(Math.random() * postcards.length)];
					whisperResponse = '';

				} else {

					if (whisperResponse === '') {
						recording.set(false);
						processing.set(false);
						whisperResponse = 'Please record an answer first.';

						new Promise(resolve => setTimeout(resolve, 10000))
							.then(() => whisperResponse = '');

					} else {
						// Set button 2 to false here so it can't be pressed twice to record twice.
						createResponse();
						recording.set(false);
						processing.set(false);
						whisperResponse = '';

					}
				}
			};
		})
	};

  const useForm = () => {
    return async ({ result, update }) => {
      if (result.type === 'success') {
        whisperResponse = '';
        saving.set(false);
      }
    };
  }
	
	</script>
  
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

{#if $recording === true || $processing === true || $saving === true}
  <div class="processing-overlay" transition:fade>
		<h4>
			{#if $recording}
				'Recording...'
			{:else if $processing}
				'Transcribing...'
			{:else if $saving}
				'Saving...'
			{/if}
		</h4>
    <CircularProgress style="height: 128px; width: 128px;" indeterminate />
  </div>
{/if}

<form bind:this={form} action="?/save" method="POST" use:enhance={useForm}>
	<input hidden name="postcardId" bind:value={currentPostcard.id} />
	<input hidden name="response" bind:value={whisperResponse} />
</form>

<!-- Fix these colors to match the colors of the henge buttons -->
<!-- Swap these button functionalities for what area of the page the user is on -->
<!--
<div class="instructions">
  <div class="instruction instruction1 poetsen-one-regular">INFO</div>
  <div class="instruction instruction2 poetsen-one-regular">RECORD</div>
  <div class="instruction instruction3 poetsen-one-regular">SUBMIT</div>
</div>
-->

<style>
  .postcard {
    display: flex;
    color: #f489a3;
    font-size: 3.2rem;
    max-height: 100vh;
    justify-content: center;
    align-items: center;
    background-repeat: no-repeat;
    background-position: right;
    background-size: contain;
  }
  .postcard-text {
    position: absolute;
  	top: 8vh;
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
  }*/
</style>
