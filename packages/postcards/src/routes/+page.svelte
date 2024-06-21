<script lang="ts">
	import { fade } from 'svelte/transition';
	import Typewriter from 'svelte-typewriter';
	import { v4 as uuidv4 } from 'uuid';
	import Penny from '$lib/Penny.svg';
	import { postcards } from '$lib/Postcards';
	import mqtt from 'mqtt';
	import type { ISubscriptionGrant, MqttClient } from 'mqtt';
  import { browser } from '$app/environment';
	import { writable } from 'svelte/store';
	import { button1, button2, button3, processing, recording } from '$lib/stores';
	import CircularProgress from '@smui/circular-progress';
	import type { PageData } from './$types';
  
	const BUTTON_1_TOPIC = 'home/penny3/arduino/buttons-board/button-1';
	const BUTTON_2_TOPIC = 'home/penny3/arduino/buttons-board/button-2';
	const BUTTON_3_TOPIC = 'home/penny3/arduino/buttons-board/button-3';
	const MOSQUITTO_RECORDING_TOPIC = 'home/penny3/record';
  
  let whisperResponse: string = '';

  let currentPostcard: Postcard = postcards[Math.floor(Math.random() * postcards.length)];
  let answer: Postcard = currentPostcard;
  
  let answers = currentPostcard.answer;
  let answerId = uuidv4();
  
	const options = {
	  keepalive: 1,
	  clean: false,
	  connectTimeout: 4000,
	  clientId: 'penny-3-henge',
	}
  
	let client = writable<MqttClient | null>(null);

	const createResponse = async () => {
    // Send a POST request to the create upload endpoint
    const createPostcardResponse = await fetch(`${data.API_URL}/postcard/create?postcardId=${currentPostcard.id}&response=${whisperResponse}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });

		console.log(createPostcardResponse);

    // If the request was not successful, return an error response
    if (!createPostcardResponse.ok) {
      return { success: false, error: 'Failed to create upload.' };
    }
	}

	const startProcessing = async () => {
		processing.set(true);
				
		await fetch('http://192.168.0.10:8000/transcribe', {
			headers: {
				'no-cors': 'true',
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Access-Control-Allow-Origin': '*'
			}
		})
			.then((res) => res.json())
			.then(data => {
				console.log(data);
				whisperResponse = data;
				answer.answerId = answerId;
				answer.answer = data;
				$processing = false;
				$button2 = false;
			})
	}

	if (browser) {
	  $client = mqtt.connect('ws://192.168.0.10:8083', options);
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

				button2.set(true);
				recording.set(true);
				processing.set(false);

				$client?.publish(MOSQUITTO_RECORDING_TOPIC, 'START', { qos: 0, retain: false });
			
			} else if (_topic === BUTTON_2_TOPIC && message.toString() === "0") {

				button2.set(false);
				recording.set(false);
				processing.set(false);

				$client?.publish(MOSQUITTO_RECORDING_TOPIC, 'STOP', { qos: 0, retain: false });

				startProcessing();

			} else if (_topic === BUTTON_3_TOPIC && message.toString() === "1") {
				if (whisperResponse === '') {

					button1.set(true);
					recording.set(false);
					processing.set(false);
					
					currentPostcard = postcards[Math.floor(Math.random() * postcards.length)];
					answers = currentPostcard.answer;
					answerId = uuidv4();
					whisperResponse = '';

					button1.set(false);

				} else {

					if (whisperResponse === '') {
						recording.set(false);
						processing.set(false);
						whisperResponse = 'Please record an answer first.';

						new Promise(resolve => setTimeout(resolve, 10000))
							.then(() => whisperResponse = '');

						$button3 = false;
					} else {
						// Set button 2 to false here so it can't be pressed twice to record twice.
						createResponse();
						recording.set(false);
						processing.set(false);
						whisperResponse = '';
						$button3 = false;
						
					}

				}
			};
		})
	};
	
	export let data: PageData;
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

{#if $recording === true || $processing === true}
  <div class="processing-overlay" transition:fade>
    {$recording ? 'Recording...' : 'Processing...'}
    <CircularProgress style="height: 64px; width: 64px;" indeterminate />
  </div>
{/if}

<!-- Fix these colors to match the colors of the henge buttons -->
<!-- Swap these button functionalities for what area of the page the user is on -->

<div class="instructions">
  <div class="instruction instruction1 poetsen-one-regular">INFO</div>
  <div class="instruction instruction2 poetsen-one-regular">RECORD</div>
  <div class="instruction instruction3 poetsen-one-regular">SUBMIT</div>
</div>

<style>
  .postcard {
    display: flex;
    color: #f489a3;
    font-size: 3.2rem;
    height: 100vh;
    justify-content: center;
    align-items: center;
    background-repeat: no-repeat;
    background-position: right;
    background-size: contain;
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
    background-color: rgba(0, 0, 0, 0.5);
  }
  .instructions {
    position: fixed;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
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
		margin-left: 100px;
		padding-top: 30px;
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
		margin-left: 400px;
    background-color: #108d40;
  }
</style>
