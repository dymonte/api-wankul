import json
with open('data/cards.json', 'r') as f:
    cards = json.load(f)["cards"]


d=[]

for card in cards:
    if card['rarity'] not in d:
        # d[card['rarityId']] = card['rarity']
        d.append(card['rarity'])

d.sort(key=lambda x: x['id'])


with open('data/rarity.json', 'w') as f:
    json.dump(d, f, indent=4)