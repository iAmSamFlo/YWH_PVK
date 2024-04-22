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
// const Knex = require('knex');

// // createUnixSocketPool initializes a Unix socket connection pool for
// // a Cloud SQL instance of Postgres.
// const createUnixSocketPool = async config => {
//     // Note: Saving credentials in environment variables is convenient, but not
//     // secure - consider a more secure solution such as
//     // Cloud Secret Manager (https://cloud.google.com/secret-manager) to help
//     // keep secrets safe.
//     return Knex({
//       client: 'pg',
//       connection: {
//         user: process.env.DB_USER, // e.g. 'my-user'
//         password: process.env.DB_PASS, // e.g. 'my-user-password'
//         database: process.env.DB_NAME, // e.g. 'my-database'
//         host: process.env.INSTANCE_UNIX_SOCKET, // e.g. '/cloudsql/project:region:instance'
//       },
//       // ... Specify additional properties here.
//       ...config,
//     });
//   };

// app.get('/get-database', async (req, res) => {
//     try {
//         const re = createUnixSocketPool.select('*').from('users');

//         res.send(re);
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).send('Internal Server Error');
//     }
// });
