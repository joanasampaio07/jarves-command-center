import urllib.request
import json

api_key = 'sk_775fb5f6b7e47b666ef4048b765f99c7c3385624207d84eb'

# Search voices in ElevenLabs library for Portuguese / Brazil / Jarvis
req = urllib.request.Request('https://api.elevenlabs.io/v1/shared-voices?category=high_quality&language=pt&page_size=20', headers={'xi-api-key': api_key})
try:
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        svoices = data.get('voices', [])
        print('Shared pt voices count:', len(svoices))
        for v in svoices[:10]:
            name = v.get('name')
            vid = v.get('voice_id')
            desc = v.get('description', '')
            accent = v.get('accent', '')
            print(f"- {name} | ID: {vid} | accent: {accent} | desc: {desc}")
except Exception as e:
    print('Shared voices error:', e)
