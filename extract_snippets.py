import re
import json

bundle_path = r"C:\Users\Admin\.gemini\antigravity-ide\scratch\megajarvis-app\index-DKZuLfeW.js"

with open(bundle_path, "r", encoding="utf-8", errors="ignore") as f:
    content = f.read()

components = {
    "CommandCenter (zNt)": "zNt",
    "Dashboard (sRt)": "sRt",
    "Finances (D3t)": "D3t",
    "Habits (N3t)": "N3t",
    "Tasks (Y5t)": "Y5t",
    "Projects (qLt)": "qLt",
    "HowToUse (djt)": "djt",
    "Settings (t4t)": "t4t",
    "Support (q5t)": "q5t",
    "Analytics (SXe)": "SXe",
    "Calendar (rBt)": "rBt",
    "TextChat (_Vt)": "_Vt",
    "News (AVt)": "AVt",
    "Integrations (EVt)": "EVt",
    "Personalization (CVt)": "CVt",
    "Admin (tBt)": "tBt",
    "Layout (X5t)": "X5t"
}

results = {}

for label, func_name in components.items():
    pos = content.find(f"function {func_name}(")
    if pos == -1:
        pos = content.find(f"const {func_name}=")
    if pos == -1:
        pos = content.find(f"{func_name}=")
    
    if pos != -1:
        # extract around 4000 characters
        snippet = content[pos:pos+6000]
        results[label] = {
            "pos": pos,
            "snippet": snippet
        }
        print(f"Found {label} at pos {pos} (extracted 6000 chars)")
    else:
        print(f"NOT found: {label}")

with open(r"C:\Users\Admin\.gemini\antigravity-ide\scratch\megajarvis-app\extracted_component_snippets.json", "w", encoding="utf-8") as f:
    json.dump(results, f, indent=2, ensure_ascii=False)

print("Saved snippets to extracted_component_snippets.json")
