import re

bundle_path = r"C:\Users\Admin\.gemini\antigravity-ide\scratch\megajarvis-app\index-DKZuLfeW.js"

with open(bundle_path, "r", encoding="utf-8", errors="ignore") as f:
    content = f.read()

pos_pme = content.find("PMe={")
if pos_pme != -1:
    print("PMe found at:", pos_pme)
    print("PMe snippet:", content[pos_pme:pos_pme+500])
else:
    # search regex
    m = re.search(r'[A-Za-z0-9_]+=\{[A-Za-z0-9_]+:[A-Za-z0-9_]+,[A-Za-z0-9_]+:[A-Za-z0-9_]+', content[-100000:])
    if m:
        print("Match at end:", m.group(0))

# Also find YTe
pos_yte = content.find("YTe={")
if pos_yte != -1:
    print("YTe snippet:", content[pos_yte:pos_yte+300])
