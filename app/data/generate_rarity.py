import json

with open("data/cards.json", "r", encoding="utf-8") as f:
    cards = json.load(f)["cards"]

d = []

for card in cards.values():
    rarity = card.get("rarity")
    if rarity is not None and rarity not in d:
        d.append(rarity)

d.sort(key=lambda x: x["id"])

with open("data/rarity.json", "w", encoding="utf-8") as f:
    json.dump(d, f, indent=4, ensure_ascii=False)