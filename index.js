const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http');
const fs = require('fs');

const { zplPdfRequest } = require('./zplGenerator.js')

app.use(bodyParser.json())

const PORT = 8080;


let samples = [];

//Use the public directory
app.use(express.static('labels'));

// GET to retrieve all the samples
app.get('/', async (req, res) => {
    res.json(samples)
})

// GET to retrive the result of a player
app.get('/result/:player', async (req, res) => {
    const owner = req.params.player;
    const filename = `/labels/${owner[0].toUpperCase() + owner.slice(1)}.png`;
    const path = __dirname + filename;
    console.log(path);
    if(fs.existsSync(path)){
        res.status(200);
        res.sendFile(path);
    }else{
        res.status(400);
        res.json({
            msg: 'Not found'
        });
    }
    
})

app.post('/', async (req, res) => {
    const body = req.body
    const owner = body.owner
    samples.push(req.body)
    // generates a zpl file with the info from the game
    const result = zplPdfRequest(samples, owner)
    if(result != 'Error'){
        res.status(200);
        res.json(samples)
    }else{
        res.status(500)
    }

})

app.listen(
    PORT,
    () => {
        console.log(`Server listening on port: ${PORT}`)
    }
)