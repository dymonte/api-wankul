const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

let commands=[
    {
        id : 1,
        name: 'card',
    }
];

app.get('/v1', (req, res) => {
    const commandsRef = commands.map(com=>Object.assign({},com,{"link":`/v1/${com.name}`}));
    res.json(commandsRef);
});

app.listen(port, () => console.log(`App listening on port ${port}!`));