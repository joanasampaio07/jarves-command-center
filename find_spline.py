import re

bundle_path = r"C:\Users\Admin\.gemini\antigravity-ide\scratch\megajarvis-app\index-DKZuLfeW.js"

with open(bundle_path, "r", encoding="utf-8", errors="ignore") as f:
    content = f.read()

pos = content.find("kZDDjO5HuC9GJUM2/scene.splinecode")
if pos != -1:
    print("Found spline scene code at pos:", pos)
    print(content[max(0, pos-400):min(len(content), pos+800)])

# Find BNt definition
pos_bnt = content.find("BNt=")
if pos_bnt == -1:
    pos_bnt = content.find("function BNt(")
if pos_bnt != -1:
    print("\n=== BNt definition ===")
    print(content[pos_bnt:pos_bnt+1200])
