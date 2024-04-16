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
// let secret = "AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg";

app.get('/get-secret', async (req, res) => {
    try {
        // Logic to fetch the secret
        res.send(secret);
    } catch (error) {
        console.error('Error fetching secret:', error);
        res.status(500).send('Error fetching secret');
    }
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

// DATABAS KOD !!!!!
const pg = require('pg');
const {Connector} = require('@google-cloud/cloud-sql-connector');
const {Pool} = pg;

const connector = new Connector();
const clientOpts = connector.getOptions({
  instanceConnectionName: 'stockholm-safety-map:europe-west1:ywhinstancepostgressql1',
  ipType: 'PUBLIC',
});
const pool = new Pool({
  ...clientOpts,
  user: 'postgres',
  password: 'FindTheWayHome1337',
  database: 'db-ywh',
  max: 5,
});
const {rows} = pool.query('SELECT NOW()');
console.table(rows); // prints returned time value from server

pool.end();
connector.close();