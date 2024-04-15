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

const connectorPool = require('./connect.js');
let pool;

app.use(async (req, res, next) => {
    if (pool) {
      return next();
    }
    try {
      pool = await createPoolAndEnsureSchema();
      next();
    } catch (err) {
      logger.error(err);
      return next(err);
    }
  });

  // Initialize Knex, a Node.js SQL query builder library with built-in connection pooling.
const createPool = async () => {
    // Configure which instance and what database user to connect with.
    // Remember - storing secrets in plaintext is potentially unsafe. Consider using
    // something like https://cloud.google.com/kms/ to help keep secrets secret.
    const config = {pool: {}};
  
    // [START cloud_sql_postgres_knex_limit]
    // 'max' limits the total number of concurrent connections this pool will keep. Ideal
    // values for this setting are highly variable on app design, infrastructure, and database.
    config.pool.max = 5;
    // 'min' is the minimum number of idle connections Knex maintains in the pool.
    // Additional connections will be established to meet this value unless the pool is full.
    config.pool.min = 5;
    // [END cloud_sql_postgres_knex_limit]
  
    // [START cloud_sql_postgres_knex_timeout]
    // 'acquireTimeoutMillis' is the number of milliseconds before a timeout occurs when acquiring a
    // connection from the pool. This is slightly different from connectionTimeout, because acquiring
    // a pool connection does not always involve making a new connection, and may include multiple retries.
    // when making a connection
    config.pool.acquireTimeoutMillis = 60000; // 60 seconds
    // 'createTimeoutMillis` is the maximum number of milliseconds to wait trying to establish an
    // initial connection before retrying.
    // After acquireTimeoutMillis has passed, a timeout exception will be thrown.
    config.pool.createTimeoutMillis = 30000; // 30 seconds
    // 'idleTimeoutMillis' is the number of milliseconds a connection must sit idle in the pool
    // and not be checked out before it is automatically closed.
    config.pool.idleTimeoutMillis = 600000; // 10 minutes
    // [END cloud_sql_postgres_knex_timeout]
  
    // [START cloud_sql_postgres_knex_backoff]
    // 'knex' uses a built-in retry strategy which does not implement backoff.
    // 'createRetryIntervalMillis' is how long to idle after failed connection creation before trying again
    config.pool.createRetryIntervalMillis = 200; // 0.2 seconds
    // [END cloud_sql_postgres_knex_backoff]
  
    // Check if a Secret Manager secret version is defined
    // If a version is defined, retrieve the secret from Secret Manager and set as the DB_PASS
    const {CLOUD_SQL_CREDENTIALS_SECRET} = process.env;
    if (CLOUD_SQL_CREDENTIALS_SECRET) {
      const secrets = await accessSecretVersion(CLOUD_SQL_CREDENTIALS_SECRET);
      try {
        process.env.DB_PASS = secrets.toString();
      } catch (err) {
        err.message = `Unable to parse secret from Secret Manager. Make sure that the secret is JSON formatted: \n ${err.message} `;
        throw err;
      }
    }
    if (process.env.INSTANCE_CONNECTION_NAME) {
      // Uses the Cloud SQL Node.js Connector when INSTANCE_CONNECTION_NAME
      // (e.g., project:region:instance) is defined
      if (process.env.DB_USER) {
        //  Either a DB_USER or a DB_IAM_USER should be defined. If both are
        //  defined, DB_IAM_USER takes precedence
        return createConnectorIAMAuthnPool(config);
      } else {
        return connectorPool(config);
      }
    } else {
      throw 'One of INSTANCE_HOST or INSTANCE_UNIX_SOCKET` is required.';
    }
};

const createPoolAndEnsureSchema = async () =>
  await createPool()
    .then(async pool => {
      return pool;
    })
    .catch(err => {
      logger.error(err);
      throw err;
    });

    
const getVal = async pool => {
    return await pool
      .select('*')
      .from('users');
  };

app.get('/get-database', async (req, res) => {
    try {
        // Logic to fetch the secret
        res.send(getVal);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
    }
});

console.log(getVal);