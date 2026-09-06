import re
import json

bundle_path = r"C:\Users\Admin\.gemini\antigravity-ide\scratch\megajarvis-app\index-DKZuLfeW.js"

with open(bundle_path, "r", encoding="utf-8", errors="ignore") as f:
    content = f.read()

# Let's search for entity definitions / schema definitions
# Base44 defines entities like: createEntityClient or entities = { ... } or schema: { ... }
entity_schemas = {}
for entity in ["ActivityLog", "AppTutorial", "FinancialTransaction", "Habit", "HabitLog", "Project", "RawMessage", "Reminder", "SupportTicket", "Task", "TaskOccurrence", "User", "Wallet"]:
    # Find occurrences of entity name and context around it
    pattern = rf'["\']?{entity}["\']?\s*:\s*\{{[^}}]+(?:\{{[^}}]+}}[^}}]*)*\}}'
    matches = list(re.finditer(rf'["\']{entity}["\']', content))
    print(f"Entity {entity}: {len(matches)} occurrences")

# Find route elements / components
# e.g., createBrowserRouter or Routes or path: "/...", element: <...
route_defs = re.findall(r'\{[^{}]*path:\s*["\']([^"\']+)["\'][^{}]*\}', content)
print("\n--- Route objects ---")
for r in route_defs:
    print(r)

# Search for page files / component names in strings or comments
page_matches = re.findall(r'pages/([A-Za-z0-9_/-]+)', content)
print("\n--- Page files mentioned ---")
print(set(page_matches))

# Look for component definitions and state
# Search for Portuguese UI strings and headings to understand all features
pt_strings = re.findall(r'["\']([A-ZÀ-Ú][a-zà-ú0-9\s,\.!\?\-:\/]{5,60})["\']', content)
print(f"\n--- Portuguese UI Strings count: {len(pt_strings)} ---")

# Let's group by keywords
keywords = ["Jarves", "Marvis", "Command", "Tarefa", "Hábito", "Financeiro", "Carteira", "WhatsApp", "Calendário", "Transação", "Áudio", "Voz", "Personalização", "Integração", "Notícias", "Chat"]
categorized = {k: [] for k in keywords}

for s in set(pt_strings):
    for k in keywords:
        if k.lower() in s.lower():
            categorized[k].append(s)

for k, items in categorized.items():
    print(f"\n[{k}] ({len(items)} strings):")
    for item in sorted(items)[:10]:
        print(f"  - {item}")

# Let's search for API / Base44 endpoints or config
configs = re.findall(r'https?://[^\s"\'`<>]+', content)
print("\n--- URLs in bundle ---")
api_urls = set([u for u in configs if "supabase" in u or "base44" in u or "api" in u or "openai" in u or "groq" in u])
for u in sorted(api_urls):
    print(f"  - {u}")
