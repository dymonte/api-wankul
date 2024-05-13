const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');


const start = (port) => {
    const app = express();



    app.use(bodyParser.json());

    const cardsJsonPath = path.resolve(__dirname, 'data/cards.json');
    const cardsJson = fs.readFileSync(cardsJsonPath);
    const cards = JSON.parse(cardsJson);

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
        res.json(cards.map(card => { return { "id": card.id, "name": card.name, "link": `/v1/card/${card.id}` } }));
    })

    app.get('/v1/card/:id', (req, res) => {
        const id = req.params.id - 1;
        if (!cards[id]) { return res.status(404).json({ error: 'Card not found' }); }
        else {
            const card = cards[id];
            res.json(card);
        }

    })
    app.listen(port, () => console.log(`App listening on port ${port}!`));

    return app;
}

module.exports = { start: start }