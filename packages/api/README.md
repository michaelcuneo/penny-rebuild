# Setup

~~~ terminal
python3.9 -m venv venv
source venv/bin/activate
export PYTHONPATH=$PWD

# MAC
brew install portaudio
# Linux
sudo apt install libasound-dev portaudio19-dev libportaudiocpp0
 
pip install -r requirements.txt
~~~

## Raspberry Pi Speech to Text on the Edge

## Recording Audio

The python script audioRecord.py records audio for 10 seconds and saves the audio to audioFiles/recorded_audio.wav.
This script has been tailored to work with the Rode Ai-Micro Audio device so your milage may vary.

Packages to get audioRecord.py working.

~~~ terminal
pip install pyaudio
~~~

## Faster Whipser

Link to Faster Whisper: <https://github.com/SYSTRAN/faster-whisper>

The models will download themselves when the script is first ran. This includes "tiny.en" which is the smallest english only Whisper model from OpenAI. The other model installed is the "toxic_debiased-c7548aa0.ckpt" which shows if the contents of text is toxic or not and to what degree it is toxic.

If you cannot get audioRecording.py working with a microphone there is a test audio file called jfk.wav to test the script on.

Packages to get audioPostcard.py working.

~~~ terminal
pip install faster_whisper

pip install detoxify

pip install profanityfilter

pip install pandas
~~~

Before running audioPostcard.py you may need to comment the first two lines. They are there becuase I am doing this branch on my PC instead of on the Raspberry Pi and I ran into difficulties. Long story short those lines do not exist on on the Pi version but for windows you may need them.

The output from audioPostcard.py is transcription.json and has the following format.

~~~ json
{
    "toxicity_results": {
        "toxicity": 0.00429,
        "severe_toxicity": 0.0,
        "obscene": 6e-05,
        "identity_attack": 0.00173,
        "insult": 0.00054,
        "threat": 7e-05,
        "sexual_explicit": 3e-05
    },
    "censored_text": "And so, my fellow Americans ask not what your country can do for you ask what you can do for your country. "
}
~~~

This will more than likely be the final format. The above example does not showcase the profanity filter in action but I can confirm that it does work as intended. Where profanity is covered with "****".
