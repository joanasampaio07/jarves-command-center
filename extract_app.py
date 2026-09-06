import re
import json
import os

bundle_path = r"C:\Users\Admin\.gemini\antigravity-ide\scratch\megajarvis-app\index-DKZuLfeW.js"

with open(bundle_path, "r", encoding="utf-8", errors="ignore") as f:
    content = f.read()

print(f"Bundle size: {len(content):,} characters")

# Find base44 / app configuration
matches_keys = re.findall(r'base44|supabase|apiKey|projectId|appId', content, re.IGNORECASE)
print("Key hits:", len(matches_keys))

# Find routes / pages
pages = set()
for match in re.finditer(r'path:\s*["\']([^"\']+)["\']', content):
    pages.add(match.group(1))

print("\n--- Routes Defined ---")
for p in sorted(pages):
    print(f"Route: {p}")

# Look for Page components / titles / menu items
titles = set(re.findall(r'title:\s*["\']([^"\']{3,50})["\']', content))
print(f"\n--- Titles found ({len(titles)}) ---")
for t in sorted(titles)[:30]:
    print(f"- {t}")

# Look for Entities / Models / Tables
entities = set(re.findall(r'["\']([a-zA-Z0-9_]+)["\']\s*:\s*\{\s*fields\s*:', content))
if not entities:
    entities = set(re.findall(r'entities\.([A-Za-z0-9_]+)', content))
    if not entities:
        entities = set(re.findall(r'base44\.entities\.([a-zA-Z0-9_]+)', content, re.I))

print(f"\n--- Entities found ({len(entities)}) ---")
for e in sorted(entities):
    print(f"- {e}")

# Search for navigation items, menus, icons
nav_matches = re.findall(r'\{\s*name:\s*["\']([^"\']+)["\'],\s*path:\s*["\']([^"\']+)["\']', content)
if nav_matches:
    print(f"\n--- Navigation Items ({len(nav_matches)}) ---")
    for name, path in nav_matches:
        print(f"  {name} -> {path}")

# Search for sections/modules in the app
sections = set(re.findall(r'["\'](CommandCenter|Financas|Tarefas|Habitos|Metas|Saude|Rotina|Projetos|Diario|Estudos|Inteligencia|Chat|Configuracoes|Agendamentos|Leads|Clientes|WhatsApp|Integracoes|Documentos|Notas)[A-Za-z0-9_]*["\']', content, re.IGNORECASE))
print(f"\n--- Common Sections/Modules detected ---")
for s in sorted(sections):
    print(f"- {s}")

# Write a report
summary = {
    "routes": list(pages),
    "sample_titles": list(titles)[:50],
    "entities": list(entities),
    "sections": list(sections)
}

with open(r"C:\Users\Admin\.gemini\antigravity-ide\scratch\megajarvis-app\analysis_summary.json", "w", encoding="utf-8") as out:
    json.dump(summary, out, indent=2, ensure_ascii=False)

print("\nSummary written to analysis_summary.json")
