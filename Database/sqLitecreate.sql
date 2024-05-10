-- database: /home/adamnjego/pvk/YWH_PVK/Database/databaseLite.db

-- Use the ▷ button in the top right corner to run the entire file.
CREATE TABLE Users (
    email TEXT UNIQUE,
    userID INTEGER PRIMARY KEY,
    gender TEXT NOT NULL,
    dateOfCreation DATE,
    dateOfBirth DATE,
    isAdmin INTEGER NOT NULL
);

CREATE TABLE Pin (
    pinID INTEGER PRIMARY KEY,
    dateOfCreation DATE NOT NULL,
    rating INTEGER NOT NULL,
    message TEXT,
    tags TEXT, 
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    radius FLOAT NOT NULL,
    userID INTEGER,
    FOREIGN KEY(userID) REFERENCES Users(userID)
);
