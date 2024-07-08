const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { json } = require('body-parser');


const start = (port) => {
    const app = express();



    app.use(json());

    const cardsJsonPath = path.resolve(__dirname, 'data/cards.json');
    const cardsJson = fs.readFileSync(cardsJsonPath);
    const cards = JSON.parse(cardsJson)["cards"];
    cards.sort((a, b) => a["id"] - b["id"]);



    const raritiesJsonPath = path.resolve(__dirname, 'data/rarity.json');
    const raritiesJson = fs.readFileSync(raritiesJsonPath);
    const rarities = JSON.parse(raritiesJson);
    // rarities.sort((a, b) => a["id"] - b["id"]);

    let commands = [
        {
            id: 1,
            name: 'card',
            description: 'List of cards'
        }
    ];

    app.get('/v1', (req, res) => {
        const commandsRef = commands.map(com => Object.assign({}, com, { "link": `/v1/${com.name}` }));
        res.json(commandsRef);
    });

    app.get('/v1/card', (req, res) => {
        res.json(cards.map(card => { return { "id": card["id"], "name": card["title"], "link": `/v1/card/${card["id"]}`, rarity: card["rarity"]["accronym"], "drop": card["rarity"]["txDrop"] } }));
    })

    app.get('/v1/card/:id', (req, res) => {
        const id = req.params.id - 1;
        if (!cards[id]) { return res.status(404).json({ error: 'Card not found' }); }
        else {
            const card = cards[id];
            res.json(card);
        }

    })

    app.get('/v1/rarity', (req, res) => {
        res.json(rarities);
    })

    app.get('/v1/rarity/:id', (req, res) => {
        const id = req.params.id - 1;
        if (!rarities[id]) { return res.status(404).json({ error: 'Rarity not found' }); }
        else {
            const rarity = rarities[id];
            res.json(rarity);
        }
    });


    app.listen(port, () => console.log(`App listening on port ${port}!`));

    return app;
}

// export const start_api = start;
start(3000);