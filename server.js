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
let secret;

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

app.get('/check', async (req, res) => {
 if (!secret) {
   try {
     // Latency on getting the secret happens on the first request.
     // If for some reason it fails, it will retry next time.
     secret = await getSecret();
   }
   catch (e) {
     console.error(e);
   }
 }
 const target = secret || 'Ministry of Magic';
 res.send(`You serve the ${target}!`);
});

app.get('/', (req, res) => {
  const msg = "<Secret cehcker, use: > '/check'";
  res.render('index', { secret: secret});
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

// SECRET_NAME is the resource ID of the secret, passed in by environment variable.
// Format: projects/PROJECT_ID/secrets/SECRET_ID/versions/VERSION
const {SECRET_NAME} = process.env;
 
if (!SECRET_NAME) {
  console.log('Must set "SECRET_NAME" environment variable');
  process.exit(1);
}

const {SecretManagerServiceClient} = require('@google-cloud/secret-manager');
// Secret Manager Client is global for snappy reuse.
let client;

// Load the secret from Secret Manager.
async function getSecret() {
  if (!client) client = new SecretManagerServiceClient();
  if (SECRET_NAME && SECRET_NAME !== "dev") {
    try {
      const [version] = await client.accessSecretVersion({
        name: SECRET_NAME,
      });
      return version.payload.data.toString('utf8');
    }
    catch (e) {
      console.error(`error: could not retrieve secret: ${e}`);
      return
    }
  }
}