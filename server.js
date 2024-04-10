const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 8080;


app.use(bodyParser.json());

let backendRadius;
let backendCoord;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public', { 'Content-Type': 'application/javascript' }));

// The secret value is global for snappy reuse.
let secret = process.env.GoogleMapsAPI;

app.get('/get-secret', async(req, res) =>{
    if(!secret) {
        try {
            secret = await getSecret();
        } catch (e) {
            console.error(e);
            res.status(500).send('Error fetching secret');
            return;
        }
    }
    res.send(secret);
});

// Handle the button click data
app.post('/sendData', (req, res) => {
    const { radius, coord } = req.body;
    
    // Save the variables as local variables in the backend
    backendRadius = radius;
    backendCoord = coord;

    console.log('Received data from frontend:');
    console.log('Radius:', backendRadius);
    console.log('Coordinates:', backendCoord);

    // Respond to the frontend if necessary
    res.send('Data received successfully!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});


