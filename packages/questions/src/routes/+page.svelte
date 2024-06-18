<script lang="ts">
  import { fade } from 'svelte/transition';
	import { sleep } from '$lib/helper';
	import { v4 as uuidv4 } from 'uuid';
	import { questions } from '$lib/Questions';
  import mqtt from 'mqtt';
  import { browser } from '$app/environment';
  import { writable } from 'svelte/store';
  import { button1, button2, button3, processing, recording } from '$lib/stores';
	import CircularProgress from '@smui/circular-progress';

	const BUTTON_1_TOPIC = 'home/penny3/arduino/buttons-board/button-1';
  const BUTTON_2_TOPIC = 'home/penny3/arduino/buttons-board/button-2';
  const BUTTON_3_TOPIC = 'home/penny3/arduino/buttons-board/button-3';
  const MOSQUITTO_RECORDING_TOPIC = 'home/penny3/record';

	let whisperResponse: string = '';

	let answers = questions;
	let answerId = uuidv4();

	let currentQuestion: number;
	$: currentQuestion = 0;

  const options = {
    keepalive: 1,
    clean: false,
    connectTimeout: 4000,
    clientId: 'penny-1',
  }

  let client = writable<Client | null>(null);

  if (browser) {
    $client = mqtt.connect('ws://localhost:8083', options);
    $client.on('connect', () => {
      console.log('connected');

      $client?.subscribe(BUTTON_1_TOPIC, (err) => {
        if (!err) {
          console.log('Subscribed to ' + BUTTON_1_TOPIC);
        }
      });

      $client?.subscribe(BUTTON_2_TOPIC, (err) => {
        if (!err) {
          console.log('Subscribed to ' + BUTTON_2_TOPIC);
        }
      });

      $client?.subscribe(BUTTON_3_TOPIC, (err) => {
        if (!err) {
          console.log('Subscribed to ' + BUTTON_3_TOPIC);
        }
      });

      $client?.subscribe(MOSQUITTO_RECORDING_TOPIC, (err) => {
        if (!err) {
          console.log('Subscribed to ' + MOSQUITTO_RECORDING_TOPIC);
        }
      })
    });
		
		$client?.on('message', (_topic, message) => {
			if (_topic === BUTTON_1_TOPIC && message.toString() === "1") {
				button1.set(true);
				recording.set(false);
				processing.set(false);

				answers = questions;
				currentQuestion = 0;
				whisperResponse = '';

				button1.set(false);
			}
			if (_topic === BUTTON_2_TOPIC && message.toString() === "1") {
				button2.set(true);
				$recording = true;

        $client?.publish(MOSQUITTO_RECORDING_TOPIC, 'START');
        sleep(20000).then(() => {
          $recording = false;
					$processing = true;
        });
        
        /*
				// Change this to the whisper endpoint
				fetch('http://localhost:8000/transcribe', {
						method: 'GET',
						mode: 'no-cors',
						headers: {
							'Content-Type': 'application/json',
							'Accept': 'application/json',
							'Access-Control-Allow-Origin': '*'
						}
					})
					.then((res) => {
						sleep(5000).then(() => {
							$recording = false;
							$processing = true;
							
							// Change this to the whisper endpoint
							fetch('http://localhost:8000/transcribe', {
								method: 'GET',
								mode: 'no-cors',
								headers: {
									'Content-Type': 'application/json',
									'Accept': 'application/json',
									'Access-Control-Allow-Origin': '*'
								}
							})
								.then((res) => console.log(res))
								.then((res) => {
									sleep(5000).then(() => { 
										whisperResponse = res.title;
										answers[currentQuestion].answerId = answerId;
										answers[currentQuestion].answer = res.title;
										$processing = false;
										$button2 = false;
									});
								});
							});
						});
        */
			}
			if (_topic === BUTTON_3_TOPIC && message.toString() === "1") {
				if (whisperResponse === '') {
					whisperResponse = 'Please record an answer first.';
					sleep(10000).then(() => whisperResponse = '');
				} else if (currentQuestion < questions.length) {
					$button3 = true;					
					whisperResponse = '';
					currentQuestion++;
				} else {
					// Set button 2 to false here so it can't be pressed twice to record twice.
					whisperResponse = '';
					$button3 = false;
					// Submit to database
				}
			};
		});
	}
</script>

<div class="question poetsen-one-regular">
	<div class="question-text" transition:fade>
		{questions[currentQuestion].question}
	</div>
	{#if $recording === false && $processing === false && whisperResponse}
		<div class="answer-text" transition:fade>
			{whisperResponse}
		</div>
	{/if}
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
	<div class="instruction instruction1 poetsen-one-regular">RESTART</div>
	<div class="instruction instruction2 poetsen-one-regular">RECORD</div>
	<div class="instruction instruction3 poetsen-one-regular">{currentQuestion < questions.length ? 'NEXT' : 'SUBMIT'}</div>
</div>

<style>
	.question {
		display: flex;
		height: 100%;
		justify-content: center;
		align-items: center;
		background-repeat: no-repeat;
		background-position: center;
		background-size: contain;
	}
	.question-text {
		position: absolute;
		color: #f489a3;
		font-size: 3.5rem;
    top: 16vh;
		left: 10vw;
		width: 60vw;
	}
	.processing-overlay {
		position: fixed;
		display: flex;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		justify-content: center;
		align-items: center;
		background-color: rgba(0, 0, 0, 0.5);
	}
	.answer-text {
		position: absolute;
		color: #4d28ee;
		font-size: 3.5rem;
    top: 22vh;
		left: 10vw;
		width: auto;
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
		color: white;
		width: 150px;
		height: 75px;
		border-top-left-radius: 75px;
		border-top-right-radius: 75px;
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
</style>
