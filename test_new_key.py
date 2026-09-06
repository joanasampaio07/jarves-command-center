import urllib.request
import json

api_key = "sk_0db4bf3a189c2745b186a2464108519137e709c5e045a1f9"
clean_key = api_key.replace("sk_", "")

# Test with xi-api-key
for k in [clean_key, api_key]:
    req = urllib.request.Request("https://api.elevenlabs.io/v1/user", headers={
        "xi-api-key": k
    })
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            print(f"Key ({k[:8]}...) SUCCESS!")
            sub = data.get("subscription", {})
            print(f"Tier: {sub.get('tier')}, Characters: {sub.get('character_count')}/{sub.get('character_limit')}")
            
            # Now list voices
            req_voices = urllib.request.Request("https://api.elevenlabs.io/v1/voices", headers={"xi-api-key": k})
            with urllib.request.urlopen(req_voices) as vresp:
                vdata = json.loads(vresp.read().decode("utf-8"))
                print(f"Total voices: {len(vdata.get('voices', []))}")
                for v in vdata.get('voices', [])[:15]:
                    print(f"  - {v.get('name')} (ID: {v.get('voice_id')}) -> {v.get('labels', {})}")
            break
    except Exception as e:
        print(f"Key ({k[:8]}...) Error: {e}")
