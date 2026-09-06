import re

bundle_path = r"C:\Users\Admin\.gemini\antigravity-ide\scratch\megajarvis-app\index-DKZuLfeW.js"

with open(bundle_path, "r", encoding="utf-8", errors="ignore") as f:
    content = f.read()

# Let's search for OMe definition
pos_ome = content.find("OMe=")
if pos_ome != -1:
    print("OMe definition:", content[pos_ome-20:pos_ome+50])

# Let's inspect the page functions: PVt, tBt, rBt, _Vt, AVt, EVt, CVt
for name in ["PVt", "tBt", "rBt", "_Vt", "AVt", "EVt", "CVt", "bm"]:
    pos = content.find(f"function {name}")
    if pos == -1:
        pos = content.find(f"const {name}=")
    if pos == -1:
        pos = content.find(f"{name}=")
    if pos != -1:
        print(f"\n=== Component {name} at {pos} ===")
        print(content[pos:pos+300])

# Let's search for how pages like Tasks, Finances, Habits, Projects, Analytics, HowToUse are rendered.
# Are they tabs or modals or sub-components in CommandCenter / Dashboard, or route pages?
for term in ["Tasks", "Finances", "Habits", "Projects", "HowToUse", "Analytics", "Support", "Settings"]:
    matches = [m.start() for m in re.finditer(rf'["\']{term}["\']', content)]
    print(f"Term '{term}' matches: {len(matches)}")
    if matches:
        for m in matches[:2]:
            print(f"  [{m}]: {content[max(0, m-50):min(len(content), m+120)]}")
