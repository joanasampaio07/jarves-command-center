import urllib.request
import json

api_key = "sk_0db4bf3a189c2745b186a2464108519137e709c5e045a1f9"
voice_id = "onwK4e9ZLuTAKqWW03F9" # Daniel (Deep British JARVIS Voice) / or pNInz6obpgDQGcFmaJgB (Adam)

url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"

payload = {
    "text": "Olá Comandante! Todos os sistemas operacionais do JARVES estão calibrados e prontos.",
    "model_id": "eleven_multilingual_v2",
    "voice_settings": {
        "stability": 0.5,
        "similarity_boost": 0.8
    }
}

req = urllib.request.Request(
    url,
    data=json.dumps(payload).encode("utf-8"),
    headers={
        "Content-Type": "application/json",
        "xi-api-key": api_key
    }
)

try:
    with urllib.request.urlopen(req) as resp:
        audio_data = resp.read()
        print(f"Success! Generated audio MP3 with {len(audio_data):,} bytes.")
        with open(r"C:\Users\Admin\.gemini\antigravity-ide\scratch\megajarvis-app\test_jarvis_audio.mp3", "wb") as f:
            f.write(audio_data)
        print("Saved test audio to test_jarvis_audio.mp3")
except Exception as e:
    print(f"Error generating audio: {e}")
    if hasattr(e, "read"):
        print("Detail:", e.read().decode("utf-8"))
