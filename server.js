const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());

let backendRadius;
let backendCoord;

// Serve static files from the 'public' directory
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public'), { index: 'preference.html' }));
app.use(express.static('public', { 'Content-Type': 'application/javascript' }));

// The secret value is global for snappy reuse.
//let secret = process.env.GoogleMapsAPI;
let secret = "AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg";

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
    console.log("hello from here");
    const { latitude, longitude, radius} = req.body;
    
    // Save the variables as local variables in the backend
    backendRadius = radius;
    backendlat = latitude;
    backendlong = longitude;

    console.log('Received data from frontend:');
    console.log('Radius:', backendRadius);
    console.log(backendlat);
    console.log(backendlong);


    // Respond to the frontend if necessary
    res.send('Data received successfully!');

    let db = new sqlite3.Database('./Database/databaseLite.db', sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                console.error(err.message);
            }
            console.log('Connected to the database.');
    });
 
    db.run(`INSERT INTO Pin(pinID, dateOfCreation, rating, message, tags, latitude, longitude, radius, userID) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`, [1, 20240101, 3, 'hello', '1,3,4', coord.latitude, coord.longitude, radius, 1], function(err) {
        if (err) {
            return console.log(err.message);
        }
        // get the last insert id
        console.log(`A pin has been inserted with rowID ${this.lastID}`);
    });
    db.close();

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
