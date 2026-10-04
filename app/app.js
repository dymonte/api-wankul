
const express = require('express');
const fs = require('fs');
const path = require('path');

const start = (port) => {
    const app = express();

    app.use(express.json());

    // === loading cards from JSON file ===

    const cardsJsonPath = path.resolve(__dirname, 'data/cards.json');
    const cardsJson = fs.readFileSync(cardsJsonPath, 'utf8');

    const cards = Object.values(JSON.parse(cardsJson).cards);

    cards.sort((a, b) => a.id - b.id);


    // === loading rarities from JSON file ===

    const raritiesJsonPath = path.resolve(__dirname, 'data/rarity.json');
    const raritiesJson = fs.readFileSync(raritiesJsonPath, 'utf8');
    const rarities = JSON.parse(raritiesJson);


    // === list of available commands ===

    const commands = [
        {
            id: 1,
            name: 'card',
            description: 'List of cards'
        },
        {
            id: 2,
            name: 'rarity',
            description: 'List of rarities'
        }
    ];


    app.get('/v1', (req, res) => {
        const commandsRef = commands.map(command => ({
            ...command,
            link: `/v1/${command.name}`
        }));

        res.json(commandsRef);
    });


    // === list all cards ===

    app.get('/v1/card', (req, res) => {
        console.log('Query parameters:', req.query);
        const season = req.query.season;

        const rarity = req.query.rarity;

        console.log(`Season: ${season}`);
        console.log(`Rarity: ${rarity}`);

        const filteredCards = cards.filter(card => {
            const matchesSeason = season === undefined
                || String(card.set?.id ?? card.set) === String(season);

            const matchesRarity = rarity === undefined
                || String(card.rarity?.id) === String(rarity);


            return matchesSeason && matchesRarity;
        });

        console.log(`Filtered cards count: ${filteredCards.length}`);

        res.json(
            filteredCards.map(card => ({
                id: card.id,
                name: card.name,
                link: `/v1/card/${card.id}`,
                rarity: card.rarity?.acronym ?? null,
                drop: card.rarity?.dropRate ?? null
            }))
        );
    });



    // === find a card by ID ===

    app.get('/v1/card/:id', (req, res) => {
        const id = Number(req.params.id);

        const card = cards.find(card => card.id === id);

        if (!card) {
            return res.status(404).json({
                error: 'Card not found'
            });
        }

        res.json(card);
    });


    // === find the name of a card by ID ===

    app.get('/v1/card/:id/name', (req, res) => {
        const id = Number(req.params.id);

        const card = cards.find(card => card.id === id);

        if (!card) {
            return res.status(404).json({
                error: 'Card not found'
            });
        }

        res.json(card.name);
    });


    // === find the rarity of a card by ID ===

    app.get('/v1/card/:id/rarity', (req, res) => {
        const id = Number(req.params.id);

        const card = cards.find(card => card.id === id);

        if (!card) {
            return res.status(404).json({
                error: 'Card not found'
            });
        }

        res.json(card.rarity);
    });


    // === find the image of a card by ID ===

    app.get('/v1/card/:id/image', (req, res) => {
        const id = Number(req.params.id);

        const card = cards.find(card => card.id === id);

        if (!card) {
            return res.status(404).json({
                error: 'Card not found'
            });
        }

        if (!card.imagePath) {
            return res.status(404).json({
                error: 'Image not found'
            });
        }

        const filePath = path.resolve(__dirname, card.imagePath);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'Image file missing on disk' });
        }

        return res.sendFile(filePath);
    });




    // app.get('/v1/card/:id/image/paysage', (req, res) => {
    //     const id = Number(req.params.id);

    //     const card = cards.find(card => card.id === id);

    //     if (!card) {
    //         return res.status(404).json({
    //             error: 'Card not found'
    //         });
    //     }

    //     if (!card.imagePaysage) {
    //         return res.status(404).json({
    //             error: 'Landscape image not found'
    //         });
    //     }

    //     const imageUrl = card.imagePaysage.startsWith('http')
    //         ? card.imagePaysage
    //         : `https://wankul.fr${card.imagePaysage}`;

    //     return res.redirect(imageUrl);
    // });


    // === list all rarities ===

    app.get('/v1/rarity', (req, res) => {
        res.json(rarities);
    });


    // === find a rarity by ID ===

    app.get('/v1/rarity/:id', (req, res) => {
        const id = req.params.id;

        const rarity = Array.isArray(rarities)
            ? rarities.find(rarity => String(rarity.id) === String(id))
            : rarities[id];

        if (!rarity) {
            return res.status(404).json({
                error: 'Rarity not found'
            });
        }

        res.json(rarity);
    });

    // === start the server ===

    app.listen(port, () => {
        console.log(`App listening on port ${port}!`);
    });

    return app;
};

start(3000);
