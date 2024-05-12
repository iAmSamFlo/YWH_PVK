
class Pin{
    constructor(lat, lng, radius, rating){
        this.latitude = lat;
        this.longitude = lng;
        // this.coords = {lat: lat, lng: lng};
        this.radius = radius;
        this.rating = rating;
    }
}

const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());



// Serve static files from the 'public' directory
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public'), { index: 'preference.html' }));
app.use(express.static('public', { 'Content-Type': 'application/javascript' }));

// The secret value is global for snappy reuse.
// let secret = process.env.GoogleMapsAPI;
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

//fetch coordinates and radius from database
app.get('/get-database', async (req, res) => {

    let db = new sqlite3.Database('./Database/databaseLite.db', sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Connected to the database.');
    });

    db.all(`SELECT latitude, longitude, radius, rating FROM Pin`, [], (err, rows) => {
        if (err) {
            throw err;
        }
        let pins = [];
        rows.forEach((row) => {
            console.log(row.latitude, row.longitude, row.radius, row.rating);
            pins.push(new Pin(row.latitude, row.longitude, row.radius, row.rating));
        });
        res.json(pins);
    });
});

// Handle the button click data
app.post('/sendData', (req, res) => {
    console.log("hello from here");
    const { latitude, longitude, radius, rate} = req.body;
    
    // Save the variables as local variables in the backend
    let backendradius = radius;
    let backendlat = latitude;
    let backendlng = longitude;
    let backendrate = rate;

    console.log('Received data from frontend:');
    console.log('Radius:', backendradius);
    console.log(backendlat);
    console.log(backendlng);
    console.log('rate: ', backendrate);


    // Respond to the frontend if necessary
    res.send('Data received successfully!');

    let db = new sqlite3.Database('./Database/databaseLite.db', sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                console.error(err.message);
            }
            console.log('Connected to the database.');
    });
 
    db.run(`INSERT INTO Pin(dateOfCreation, rating, message, tags, latitude, longitude, radius, userID) VALUES(?, ?, ?, ?, ?, ?, ?, ?)`, ['2024-05-09', backendrate, 'hello', '1,3,4', backendlat, backendlng, backendradius, 1], function(err) {
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

