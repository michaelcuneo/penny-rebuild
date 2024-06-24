<script lang="ts">
	import { fade } from 'svelte/transition';
	import { enhance } from '$app/forms';
	import Typewriter from 'svelte-typewriter';
	import mqtt from 'mqtt';
	import { questions } from '$lib/Questions';
	import researchQr from '$lib/research-code.png';
	import surveyQr from '$lib/survey-code.png';
	import type { ISubscriptionGrant, MqttClient } from 'mqtt';
	import { browser } from '$app/environment';
	import { writable } from 'svelte/store';
	import { button2, processing, recording, saving } from '$lib/stores';
	import CircularProgress from '@smui/circular-progress';
	import type { PageData } from './$types';

	const BUTTON_1_TOPIC = 'home/penny1/arduino/buttons-board/button-1';
	const BUTTON_2_TOPIC = 'home/penny1/arduino/buttons-board/button-2';
	const BUTTON_3_TOPIC = 'home/penny1/arduino/buttons-board/button-3';
	const MOSQUITTO_RECORDING_TOPIC = 'home/penny1/record';

	let whisperResponse: string = '';
	let form: HTMLFormElement;

	$: currentQuestionId = 0;
	$: currentQuestion = questions[currentQuestionId - 1];

	let answers = [
		'', // 1
		'', // 2
		'', // 3
		'', // 4
		'', // 5
		'', // 6
		'', // 7
		'', // 8
		'', // 9
		'', // 10
		'' // 11
	] as string[] | number[] | null[] | undefined[];

	let button1Text = 'INFO';
	let button2Text = '';
	let button3Text = 'ACCEPT';

	let accepted = false;

	const reset = () => {
		currentQuestionId = 1;
		recording.set(false);
		processing.set(false);
		accepted = false;
		answers = ['', '', '', '', '', '', '', '', '', '', ''] as
			| string[]
			| number[]
			| null[]
			| undefined[];
	};

	const options = {
		keepalive: 1,
		clean: false,
		connectTimeout: 4000,
		clientId: 'penny-3-henge'
	};

	let client = writable<MqttClient | null>(null);

	const createResponse = async () => {
		saving.set(true);
		form.requestSubmit();
	};

	const startProcessing = async () => {
		processing.set(true);

		await fetch('http://localhost:8000/transcribe', {
			headers: {
				'no-cors': 'true',
				'Content-Type': 'application/json',
				Accept: 'application/json',
				'Access-Control-Allow-Origin': '*'
			}
		})
			.then((res) => res.json())
			.then((data) => {
				whisperResponse = data;
				answers[currentQuestionId - 1] = whisperResponse;
				button2Text = 'Next';
				processing.set(false);
			});
	};

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

			$client?.subscribe(
				MOSQUITTO_RECORDING_TOPIC,
				(err: Error | null, granted?: ISubscriptionGrant[]) => {
					if (granted) {
						console.log('Granted:', granted);
					}
					if (!err) {
						console.log('Subscribed to ' + MOSQUITTO_RECORDING_TOPIC);
					}
				}
			);
		});

		$client.on('message', (_topic, message) => {
			if (_topic === BUTTON_1_TOPIC && message.toString() === '1') {
				reset();
			}
			if (_topic === BUTTON_2_TOPIC && message.toString() === '1') {
				recording.set(true);
				processing.set(false);

				setTimeout(() => {
					$client?.publish(MOSQUITTO_RECORDING_TOPIC, 'START', { qos: 0, retain: false });					
				}, 3000);
			
			} else if (_topic === BUTTON_2_TOPIC && message.toString() === '0') {
				recording.set(false);
				$client?.publish(MOSQUITTO_RECORDING_TOPIC, 'STOP', { qos: 0, retain: false });

				startProcessing();
			} else if (_topic === BUTTON_3_TOPIC && message.toString() === '1') {
				if (!accepted) {
					accepted = true;				}
				if (answers[currentQuestionId - 1] === '') {
					recording.set(false);
					processing.set(false);
					whisperResponse = 'Please record an answer first.';

					new Promise((resolve) => setTimeout(resolve, 10000)).then(() => (whisperResponse = ''));
				} else if (answers[currentQuestionId - 1] !== '') {
					// Set button 2 to false here so it can't be pressed twice to record twice.
					currentQuestionId++;
					recording.set(false);
					processing.set(false);
					whisperResponse = '';
				} else if (submitReady) {
					createResponse();
					recording.set(false);
					processing.set(false);
					whisperResponse = '';
					accepted = false;
				}
			}
		});
	}

	$: submitReady = answers.some((answer) => !answer);
</script>

{#if accepted}
	<div class="question poetsen-one-regular">
		<div class="question-text" transition:fade>
			<h4>
				Question {currentQuestionId} : {currentQuestion.question}
			</h4>
			{#each currentQuestion.options as option, i}
				<div class="option" transition:fade>{i + 1} : {option}</div>
			{/each}
			<div>
				Respond by speaking the numbers that correspond to your answer, or just freeform it and say
				anything you like.
			</div>
			{#if $recording === false && $processing === false}
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
{:else}
	<div class="question poetsen-one-regular">
		<div class="question-text" transition:fade>
			<Typewriter cursor={false} mode="cascade">
				<h4>Ways to respond.</h4>
				<p>
					Participation in this survey is voluntary. If you do not want to take part, you do not
					have to. If you want to participate you can respond to the survey by selecting an answer
					on the touchscreen, by speaking your responses into the microphone.
				</p>
				<h4>Privacy statement.</h4>
				<p>
					All responses are anonymous. Voice recordings will be automatically converted to text and
					the audio will not be stored.
				</p>
				<h4>Scan 'Research Statement' to read about the research before participating.</h4>
				<h4>Scan 'Private Survey' to participate in the survey online.</h4>
				<h4>
					To participate here using this henge, proceed with the button corresponding to the tick.
				</h4>
			</Typewriter>
		</div>
		<div class="qr-codes">
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
{/if}

<form bind:this={form} action="?/save" method="POST" use:enhance>
	<input hidden name="q1" value={answers[0]} />
	<input hidden name="q2" value={answers[1]} />
	<input hidden name="q3" value={answers[2]} />
	<input hidden name="q4" value={answers[3]} />
	<input hidden name="q5" value={answers[4]} />
	<input hidden name="q6" value={answers[5]} />
	<input hidden name="q7" value={answers[6]} />
	<input hidden name="q8" value={answers[7]} />
	<input hidden name="q9" value={answers[8]} />
	<input hidden name="q10" value={answers[9]} />
	<input hidden name="q11" value={answers[10]} />
</form>

<!-- Fix these colors to match the colors of the henge buttons -->
<!-- Swap these button functionalities for what area of the page the user is on -->
<!--
<div class="instructions">
	<div class="instruction instruction1 poetsen-one-regular">{button1Text}</div>
	<div class="instruction instruction2 poetsen-one-regular">{button2Text}</div>
	<div class="instruction instruction3 poetsen-one-regular">{button3Text}</div>
</div>
-->

<style>
	.question {
		display: flex;
		flex-direction: column;
		align-items: center;
		color: #f489a3;
		width: 100vw;
		font-size: 3rem;
		height: 100vh;
	}
	.question-text {
		width: 90vw;
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
		width: 100%;
		font-size: 3.2rem;
		letter-spacing: 5px;
		text-shadow:
			-1px -1px 0px #313639,
			2px 2px 0px #f489a355,
			4px 4px 0px #00000055;
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
