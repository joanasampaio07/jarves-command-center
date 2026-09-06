import urllib.request
import json

raw_key = "sk_968d12513936889625c4186092bb0c43f0a72a5cdf537934"
key_without_sk = raw_key.replace("sk_", "")

for k in [raw_key, key_without_sk]:
    req = urllib.request.Request("https://api.elevenlabs.io/v1/user", headers={
        "xi-api-key": k
    })
    try:
        with urllib.request.urlopen(req) as resp:
            print(f"Key {k[:10]}... SUCCESS!")
            break
    except Exception as e:
        print(f"Key {k[:10]}... Error: {e}")
