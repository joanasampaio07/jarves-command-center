import re
import json

bundle_path = r"C:\Users\Admin\.gemini\antigravity-ide\scratch\megajarvis-app\index-DKZuLfeW.js"

with open(bundle_path, "r", encoding="utf-8", errors="ignore") as f:
    content = f.read()

# Let's inspect the router declaration at the end of the file
end_chunk = content[-30000:]
print("=== END CHUNK (Router setup) ===")
# Find route mappings
route_matches = re.findall(r'path:\s*["\']([^"\']+)["\'],\s*element:\s*([^\}]+)', end_chunk)
for path, el in route_matches:
    print(f"Path: {path} -> Element: {el[:100]}")

# Let's find all exported/rendered pages
pages_dict = {}
# Look for page definitions
matches = re.finditer(r'function\s+([A-Za-z0-9_]+)\s*\(\)\s*\{[^}]*currentPageName:\s*["\']([A-Za-z0-9_]+)["\']', content)
for m in matches:
    print(f"Wrapper: {m.group(1)} -> {m.group(2)}")

# Let's inspect the menu items array
menu_match = re.search(r'\[\{name:\s*["\']Painel["\'].*?\}\]', content)
if menu_match:
    print("\n=== MENU ARRAY ===")
    print(menu_match.group(0))

# Search for all page names in the bundle
all_pages_list = ["Dashboard", "CommandCenter", "News", "Integrations", "TextChat", "Calendar", "HowToUse", "Tasks", "Finances", "Habits", "Projects", "Reminders", "Analytics", "Support", "Personalization", "Settings", "Admin"]

for p in all_pages_list:
    pos = content.find(f'currentPageName:"{p}"')
    if pos != -1:
        snippet = content[pos-100:pos+150]
        print(f"Page {p} found: {snippet}")
    else:
        print(f"Page {p} NOT found directly with currentPageName")
