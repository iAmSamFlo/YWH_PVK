
class Pin{
    constructor(lat, lng, radius, rating, tags, message){
        this.latitude = lat;
        this.longitude = lng;
        // this.coords = {lat: lat, lng: lng};
        this.radius = radius;
        this.rating = rating;
        this.tags = tags;
        this.message = message;
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
            console.error('Error connecting to the database:', err.message);
            return res.status(500).send('Internal Server Error: Database connection failed');
        }        
        console.log('Connected to the database.');
    });

    try {
        const rows = await new Promise((resolve, reject) => {
            db.all(`SELECT latitude, longitude, radius, rating, tags, message FROM Pin`, [], (err, rows) => {
                if (err) {
                    return reject(err);
                }
                resolve(rows);
            });
        });
        let pins = rows.map(row => {
            return new Pin(row.latitude, row.longitude, row.radius, row.rating, row.tags, row.message);
        });
        console.log('fetch data');
        console.log('Fetched data from the database:')
        pins.forEach(pin => {
            
            console.log('Latitude:', pin.latitude, 'Longitude:', pin.longitude,'Radius:', pin.radius,'Rating:', pin.rating,'Tags:', pin.tags, 'Message:', pin.message);
        });
        res.json(pins);

    } catch (error) {
        console.error('Error fetching data from the database:', error);
        res.status(500).send('Internal Server Error: Failed to fetch data');
    } finally {
        db.close((err) => {
            if (err) {
                console.error('Error closing the database connection:', err.message);
            }
        });
    }
});

// Handle the button click data
app.post('/sendData', async (req, res) => {
    console.log("sendData");
    const { latitude, longitude, radius, rate, tags, message} = req.body;
    
    if (!latitude || !longitude || !radius || !rate || !tags ) { //|| !message
        return res.status(400).send('Bad Request: Missing required fields');
    }
    // Save the variables as local variables in the backend
    let backendradius = radius;
    let backendlat = latitude;
    let backendlng = longitude;
    let backendrate = rate;
    let backendtags = JSON.stringify(tags); // Convert tags array to JSON string
    // let backendmessage = message;
    let backendmessage = JSON.stringify(message);

    
    const date = new Date().toISOString().split('T')[0];

    // console.log('date: ',date);

    // console.log('Received data from frontend:');
    // console.log('Radius:', backendradius);
    // console.log('Latitude:', backendlat);
    // console.log('Longitude:', backendlng);
    // console.log('Rate:', backendrate);
    // console.log('Tags:', backendtags);
    // console.log('Message:', backendmessage);

    let db = new sqlite3.Database('./Database/databaseLite.db', sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                console.error('fel med connection till db, ', err.message);
                res.status(500).send('Internal Server Error: Failed to connect to database');
                return;            
            }
            console.log('Connected to the database.');
    });
 
    try {
        await new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO Pin(dateOfCreation, rating, message, tags, latitude, longitude, radius, userID) VALUES(?, ?, ?, ?, ?, ?, ?, ?)`,
                [date, backendrate, backendmessage, backendtags, backendlat, backendlng, backendradius, 1],
                function(err) {
                    if (err) {
                        console.error('Error inserting data into database:', err.message);
                        reject(err);
                    } else {
                        console.log(`A pin has been inserted with rowID ${this.lastID}`);
                        resolve();
                    }
                }
            );
        });
        res.send('Data received and stored successfully!');
    } catch (error) {
        console.error('Error during database operation:', error);
        res.status(500).send('Internal Server Error: Failed to insert data');
    } finally {
        db.close((err) => {
            if (err) {
                console.error('Error closing the database connection:', err.message);
            }
        });
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

