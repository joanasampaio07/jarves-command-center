import re
import json

bundle_path = r"C:\Users\Admin\.gemini\antigravity-ide\scratch\megajarvis-app\index-DKZuLfeW.js"

with open(bundle_path, "r", encoding="utf-8", errors="ignore") as f:
    content = f.read()

# Let's find all route component definitions in the bundle
# In Vite/React apps, pages are often defined as functions or imported
# Let's find strings like CommandCenter, TextChat, Calendar, Integrations, Personalization, News, Admin
pages = ["CommandCenter", "TextChat", "Calendar", "Integrations", "Personalization", "News", "Admin"]

for p in pages:
    idx = 0
    matches = []
    while True:
        pos = content.find(p, idx)
        if pos == -1:
            break
        # grab surrounding 200 chars
        snippet = content[max(0, pos-100):min(len(content), pos+200)]
        matches.append((pos, snippet))
        idx = pos + len(p) + 50
        if len(matches) > 10:
            break
    print(f"\n=== PAGE: {p} ({len(matches)} occurrences) ===")
    for pos, snip in matches[:3]:
        print(f"[{pos}]: {repr(snip)}")

# Search for sidebar / navigation links
# Search for icons used
icons = set(re.findall(r'lucide-react|lucide[A-Z][a-zA-Z0-9]+', content))
print("\nLucide mentions:", icons)

# Let's find JSX-like structures or React.createElement or _jsx calls
jsx_elements = set(re.findall(r'jsx\(([a-zA-Z0-9_]+),\s*\{([^}]+)\}', content))
print(f"JSX calls sample count: {len(jsx_elements)}")
