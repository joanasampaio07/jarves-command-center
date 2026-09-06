import re

bundle_path = r"C:\Users\Admin\.gemini\antigravity-ide\scratch\megajarvis-app\index-DKZuLfeW.js"

with open(bundle_path, "r", encoding="utf-8", errors="ignore") as f:
    content = f.read()

# Search for Spline scene code or .splinecode URL or iframe or 3D scene
spline_urls = re.findall(r'https?://[^\s"\'`<>]+prod\.spline\.design[^\s"\'`<>]+', content)
print("Spline design URLs:", spline_urls)

scenes = re.findall(r'https?://[^\s"\'`<>]+\.splinecode', content)
print("Splinecode URLs:", scenes)

all_urls = re.findall(r'https?://[^\s"\'`<>]+', content)
robot_urls = [u for u in all_urls if any(k in u.lower() for k in ["spline", "robot", "scene", "model", "three", "canvas", "3d"])]
print("Robot/3D related URLs:", robot_urls)

# Search for Voice Chat component code: zNt (CommandCenter)
pos = content.find("zNt=")
if pos == -1:
    pos = content.find("function zNt")
if pos != -1:
    print("\n=== zNt (CommandCenter/Voice Chat) definition (first 3000 chars) ===")
    print(content[pos:pos+3000])

# Search for "VOZ" or "CONVERSA"
for term in ["VOZ MASCULINA", "CONVERSA CONT", "CLIQUE E FALE", "PERMITA O MICROFONE", "VOZ FEMININA"]:
    p = content.find(term)
    if p != -1:
        print(f"\nTerm '{term}' found at {p}:")
        print(content[max(0, p-200):min(len(content), p+400)])
