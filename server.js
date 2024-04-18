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
const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const dbConfig = {
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS
};
const pool = new Pool(dbConfig);

app.get('/get-database', async (req, res) => {
    try {
        const client = await pool.connect();

        const testQuery = "SELECT * FROM users";
        const testResult = await client.query(testQuery);
        const tabCount = testResult.rows.length;
        client.release();

        res.send(tabCount);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});
