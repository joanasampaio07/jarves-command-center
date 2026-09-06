import urllib.request
import json

api_key = "sk_968d12513936889625c4186092bb0c43f0a72a5cdf537934"

# 1. Test get voices
req = urllib.request.Request("https://api.elevenlabs.io/v1/voices", headers={
    "xi-api-key": api_key
})

try:
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode("utf-8"))
        print(f"Success! Found {len(data.get('voices', []))} voices.")
        for v in data.get('voices', [])[:10]:
            print(f"- {v.get('name')}: {v.get('voice_id')} ({v.get('category')})")
except Exception as e:
    print("ElevenLabs Voices Error:", e)

# 2. Test get user info / subscription
req2 = urllib.request.Request("https://api.elevenlabs.io/v1/user", headers={
    "xi-api-key": api_key
})
try:
    with urllib.request.urlopen(req2) as resp:
        user_data = json.loads(resp.read().decode("utf-8"))
        sub = user_data.get("subscription", {})
        print("User Subscription:", sub.get("tier"), "Characters used:", sub.get("character_count"), "/", sub.get("character_limit"))
except Exception as e:
    print("ElevenLabs User Error:", e)
