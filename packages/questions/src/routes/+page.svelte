<script lang="ts">
	import { fade } from 'svelte/transition';
	import { enhance } from '$app/forms';
	import Typewriter from 'svelte-typewriter';
	import { questions } from '$lib/Questions';
	import researchQr from '$lib/research-code.png';
	import surveyQr from '$lib/survey-code.png';
	import mqtt from 'mqtt';
	import type { ISubscriptionGrant, MqttClient } from 'mqtt';
	import { browser } from '$app/environment';
	import { writable } from 'svelte/store';
	import { processing, recording, saving } from '$lib/stores';
	import CircularProgress from '@smui/circular-progress';
	import type { SubmitFunction } from '@sveltejs/kit';
	
	let dev = false;

	const BUTTON_1_TOPIC = 'home/penny1/arduino/buttons-board/button-1';
	const BUTTON_2_TOPIC = 'home/penny1/arduino/buttons-board/button-2';
	const BUTTON_3_TOPIC = 'home/penny1/arduino/buttons-board/button-3';
	const MOSQUITTO_RECORDING_TOPIC = 'home/penny1/record';

	let form: HTMLFormElement;
	let whisperResponse: string;
	let accepted: boolean;
	let answers: string[] | number[] | null[] | undefined[];

	let timeLeft: number;
	let timeLeftInterval: NodeJS.Timeout;
	let recordingTimeLeft: number;
	let recordingTimeLeftInterval: NodeJS.Timeout;

	$: timeLeft = 3;
	$: recordingTimeLeft = 20;
	$: whisperResponse = '';
	$: currentQuestionId = 0;
	$: currentQuestion = questions[currentQuestionId];
	$: answers = [
		'', // 0
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
	];
	$: accepted = false;

	const reset = () => {
		currentQuestionId = 0;
		recording.set(false);
		processing.set(false);
		saving.set(false);
		whisperResponse = '';
		accepted = false;
		answers = [
			'', // 0
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
		];
	};

	const options = {
		keepalive: 1,
		clean: false,
		connectTimeout: 4000,
		clientId: 'penny-1-henge'
	};

	let client = writable<MqttClient | null>(null);

	const createResponse = async () => {
		saving.set(true);
		if (form) {
			form.requestSubmit();
		}

		new Promise((resolve) => setTimeout(resolve, 10000)).then(() => reset());
	};

	const startProcessing = async () => {
		processing.set(true);
		clearInterval(timeLeftInterval);
		timeLeft = 3;

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
				answers[currentQuestionId] = whisperResponse;
				processing.set(false);

			});
	};

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

				// Reset the survey and start again.
				reset();

			}
			if (_topic === BUTTON_2_TOPIC && message.toString() === '1') {

				if (!$recording && !$processing) {

					// Set 3 second delay
					timeLeftInterval = setInterval(() => {
						if (timeLeft > 0) {
							
							timeLeft--;

						}
					}, 1000);

					// Set recording to false after 20 seconds.
					setTimeout(() => {
						$client?.publish(MOSQUITTO_RECORDING_TOPIC, 'START', { qos: 0, retain: false });
					}, 3000);

					// Set recording to true because 3 seconds have passed, we are now recording.
					recording.set(true);

				}

			} else if (_topic === BUTTON_2_TOPIC && message.toString() === '0') {

				if ($recording && !$processing) {

					$client?.publish(MOSQUITTO_RECORDING_TOPIC, 'STOP', { qos: 0, retain: false });
					recording.set(false);

					startProcessing();
				}

			} else if (_topic === BUTTON_3_TOPIC && message.toString() === '1') {
				if (!accepted && !submitReady) {

					accepted = true;

				} else if (answers[currentQuestionId] === '' && !submitReady) {

					recording.set(false);
					processing.set(false);
					whisperResponse = 'Please record an answer first.';

					new Promise((resolve) => setTimeout(resolve, 10000))
						.then(() => (whisperResponse = ''));

				} else if (answers[currentQuestionId] !== '' && !submitReady) {

					// Set button 2 to false here so it can't be pressed twice to record twice.
					currentQuestionId++;
					whisperResponse = '';
					recording.set(false);
					processing.set(false);

				} else if (submitReady) {

					createResponse();

				}
			}
		});
	}

	const useForm: SubmitFunction = () => {
    return async ({ result }) => {
			if (result.type === 'error') {
				whisperResponse = '';
			}
      if (result.type === 'success') {
        whisperResponse = '';
      }
    };
  }

	$: submitReady = !answers.some((answer) => answer === '');
</script>

{#if accepted}
	{#if $saving}
		<div class="question poetsen-one-regular">
			<div class="question-text" transition:fade>
				<h5>
					Questionaire Complete!
				</h5>
				<h5>
					Saving your responses...
				</h5>
				<div>
					<br />
					Thank you for completing our questionnaire.
				</div>
			</div>
		</div>
	{:else}
		<div class="question poetsen-one-regular">
			<div class="question-text" transition:fade>
				<h5>
					Question {currentQuestionId + 1} : {currentQuestion.question}
				</h5>
				{#each currentQuestion.options as option, i}
					{#if option !== ""}
						<div class="option" transition:fade>{i + 1} : {option}</div>
					{/if}
				{/each}
				{#if whisperResponse}
					{#if whisperResponse === 'Please record an answer first.'}
						<h5>PLEASE RECORD AN ANSWER FIRST</h5>
						<h5>To re-record your response hold the middle button.</h5>
						<h5>To submit your response push the right button.</h5>
					{:else}
						<h5>You have responded with: </h5>
						<p>"{whisperResponse}"</p>
						<h5>To re-record your response hold the middle button.</h5>
						<h5>To submit your response push the right button.</h5>
					{/if}
				{:else}
					<div>
					<br />
						If this question is multiple choice, you can respond by just speaking the number that corresponds to your answer, or feel free to just freeform it and say
						anything you like.
						<h5>To cancel the survey push the left button.</h5>
						<h5>To record your response hold down the middle button.</h5>
					</div>
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
					To participate in this survey, proceed by hitting the tick.
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

<form bind:this={form} action="?/save" method="POST" use:enhance={useForm}>
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

<style>
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
	.processing-overlay {
		position: fixed;
		display: flex;
		flex-direction: column;
		width: 100vw;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		justify-content: center;
		align-items: center;
		background-color: rgba(0, 0, 0, 0.9);
	}
	h4 {
		font-size: 3.2rem;
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
	h2 {
		font-size: 5rem;
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
</style>
