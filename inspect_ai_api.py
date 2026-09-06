import re
import json

bundle_path = r"C:\Users\Admin\.gemini\antigravity-ide\scratch\megajarvis-app\index-DKZuLfeW.js"

with open(bundle_path, "r", encoding="utf-8", errors="ignore") as f:
    content = f.read()

# 1. Search for function invocations / AI endpoints
func_invocations = set(re.findall(r'functions\.invoke\(["\']([^"\']+)["\']', content))
print("Base44 Functions invoked in bundle:", func_invocations)

# 2. Search for openai, groq, anthropic, gemini, realtime
ai_mentions = re.findall(r'["\']?(?:openai|model|gpt-4o|gpt-4|groq|anthropic|claude|gemini|system_prompt|temperature|messages)["\']?\s*:\s*[^,}]+', content, re.I)
print(f"AI config hits: {len(ai_mentions)}")
for m in ai_mentions[:15]:
    print("  -", m)

# 3. Search for the System Prompt of JARVES
# Look for prompt text like "Você é o Jarves", "You are Jarvis", "Assistente", "comandante"
prompts = re.findall(r'["\'](Você é (?:o )?Jarves[^"\']{20,500})["\']', content, re.I)
print("\nPrompts found:", prompts)

# Search for how zNt (VoiceChat) and _Vt (TextChat) generate assistant responses
for comp_name in ["zNt", "_Vt"]:
    pos = content.find(f"function {comp_name}")
    if pos == -1: pos = content.find(f"{comp_name}=")
    if pos != -1:
        snippet = content[pos:pos+5000]
        calls = re.findall(r'[a-zA-Z0-9_\.]+\((?:\{[^\}]+\}|["\'][^"\']+["\'])', snippet)
        print(f"\nAPI calls in {comp_name}:")
        for c in calls[:15]:
            if any(k in c.lower() for k in ["invoke", "fetch", "post", "ai", "chat", "message"]):
                print("  *", c)
