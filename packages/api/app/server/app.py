from faster_whisper import WhisperModel
import time
from profanityfilter import ProfanityFilter

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Set origins for dev mode from laptop, dev mode from desktop, and prod mode when live.
origins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:4173",
  "http://localhost:8000",
  "http://192.168.0.10:3000",
  "http://192.168.0.10:8000",
]

app.add_middleware(
  CORSMiddleware,
  allow_origins=origins,
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

@app.get("/")
async def root():
  return {"message": "Test root path, we're running!"}

@app.get("/transcribe")
async def record():
  before = time.time()

  # Change Audiopath before uploading
  # PRODUCTION
  # audioPath = "/root/NCC-Henges-New-Build/Audio/audioFiles/recorded_audio.wav"
  # HALIDE
  audioPath = "/home/michael/penny-rebuild/packages/api/audioFiles/jfk.wav"
  # LAPTOP
  # audioPath = "/Users/mjc128/Documents/penny-rebuild/packages/api/audioFiles/jfk.wav"
  
  # PRODUCTION
  # rawTextPath = "/root/NCC-Henges-New-Build/Audio/rawText.txt"
  # HALIDE
  rawTextPath = "/home/michael/penny-rebuild/packages/api/rawText.txt"
  # LAPTOP
  # rawTextPath = "/Users/mjc128/Documents/penny-rebuild/packages/api/rawText.txt"

  # PRODUCTION
  # cleanTextPath = "/root/NCC-Henges-New-Build/Audio/cleanText.txt"
  # HALIDE
  cleanTextPath = "/home/michael/penny-rebuild/packages/api/cleanText.txt"
  # LAPTOP
  # cleanTextPath = "/Users/mjc128/Documents/penny-rebuild/packages/api/cleanText.txt"

  model = WhisperModel("tiny.en", device="cpu", num_workers=4, cpu_threads=4, compute_type="int8")
  segments  = model.transcribe(audioPath, word_timestamps=False, beam_size=1)
  
  combined_text = " ".join([segment.text.strip() for segment in segments])

  # Profanity filtering
  pf = ProfanityFilter()
  censored_text = pf.censor(combined_text)

  print("Inital Speech2txt: ", censored_text)

  after = time.time()
  print(f"Time to output: {after - before:.3f}s")
  
  # Save the combined text to a file
  with open(rawTextPath, 'w') as file:
    file.write(combined_text)

  # Save the combined text to a file
  with open(cleanTextPath, 'w') as file:
    file.write(censored_text)

  print(f"Clean Text: {combined_text}")
  
  return combined_text