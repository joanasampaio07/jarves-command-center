import re

bundle_path = r"C:\Users\Admin\.gemini\antigravity-ide\scratch\megajarvis-app\index-DKZuLfeW.js"

with open(bundle_path, "r", encoding="utf-8", errors="ignore") as f:
    content = f.read()

pos = content.find("K5t={")
if pos != -1:
    print("K5t found:", content[pos:pos+1000])
else:
    # search for K5t =
    m = re.search(r'K5t\s*=\s*\{[^}]+\}', content)
    if m:
        print("K5t regex:", m.group(0))
