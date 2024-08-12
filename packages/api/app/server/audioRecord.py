import pyaudio
import wave
import paho.mqtt.client as mqtt
import threading
import time
import sys
import json

# Load device configuration
CONFIG_PATH = '/root/NCC-Henges-New-Build/config.json'

try:
    with open(CONFIG_PATH, 'r') as config_file:
        config = json.load(config_file)
        device_id = config['deviceID']
except Exception as e:
    print(f"Failed to load config file: {e}")
    sys.exit(1)

# Configuration
MQTT_SUBSCRIBE_RECORD_TOPIC = f'home/{device_id}/record'
filename = "/root/NCC-Henges-New-Build/Audio/audioFiles/recorded_audio.wav"
max_duration = 20  # Maximum duration to record if no stop signal is received
recording = False
frames = []
audio = pyaudio.PyAudio()
stream = None
device_index = 0  # Update with the correct device index for your RØDE AI-Micro
recording_thread = None

# MQTT Configuration
mqtt_broker_address = "localhost"
mqtt_client = mqtt.Client("AudioRecorder")

def start_recording():
    global recording, frames, stream
    recording = True
    frames = []

    try:
        stream = audio.open(format=pyaudio.paInt16,
                            channels=1,
                            rate=48000,
                            input=True,
                            frames_per_buffer=1024,
                            input_device_index=device_index)

        print("Recording started...")
    except Exception as e:
        print(f"Error opening audio stream: {e}")
        recording = False

def stop_recording():
    global recording, stream
    if recording:
        recording = False
        print("Recording stopped.")

        if stream is not None:
            stream.stop_stream()
            stream.close()

        try:
            wf = wave.open(filename, 'wb')
            wf.setnchannels(1)
            wf.setsampwidth(audio.get_sample_size(pyaudio.paInt16))
            wf.setframerate(48000)
            wf.writeframes(b''.join(frames))
            wf.close()
        except Exception as e:
            print(f"Error writing audio file: {e}")

def record_audio():
    global recording, frames, stream
    start_time = time.time()

    while recording and (time.time() - start_time) < max_duration:
        try:
            data = stream.read(1024, exception_on_overflow=False)
            frames.append(data)
        except Exception as e:
            print(f"Error reading audio stream: {e}")
            break
        time.sleep(0.01)  # Small delay to prevent 100% CPU usage

    if recording:
        stop_recording()

def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Connected to MQTT broker")
        client.subscribe(MQTT_SUBSCRIBE_RECORD_TOPIC)
    else:
        print(f"Failed to connect, return code {rc}")

def on_message(client, userdata, msg):
    global recording_thread
    payload = msg.payload.decode('utf-8')
    print(f"Received message: {payload}")
    if payload == "START":
        if not recording:
            start_recording()
            recording_thread = threading.Thread(target=record_audio)
            recording_thread.start()
    elif payload == "STOP":
        stop_recording()
    else:
        print("Incorrect payload format")

def mqtt_setup():
    mqtt_client.on_connect = on_connect
    mqtt_client.on_message = on_message

    try:
        mqtt_client.connect(mqtt_broker_address, 1883, 60)
        mqtt_client.loop_start()
    except Exception as e:
        print(f"Failed to connect to MQTT broker: {e}")
        sys.exit(1)

if __name__ == "__main__":
    mqtt_setup()

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        pass

    if recording:
        stop_recording()

    audio.terminate()

