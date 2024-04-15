CREATE TABLE Users
(
email text CONSTRAINT UserKey PRIMARY KEY,
userName VARCHAR(100) UNIQUE,
gender VARCHAR(30) NOT NULL,
dateOfCreation DATE,
dateOfBirth DATE,
isAdmin BOOLEAN NOT NULL
);

CREATE TABLE Pin
(
pinID INTEGER CONSTRAINT PinKey PRIMARY KEY,
dateOfCreation DATE NOT NULL,
rating INTEGER NOT NULL,
message TEXT,
tags VARCHAR(100)[],
fk_email text,
CONSTRAINT fk_pin_email
    FOREIGN KEY(fk_email)
        REFERENCES Users(email)
);

CREATE TABLE PinCircle
(
pinID INTEGER,
circleArea CIRCLE NOT NULL,
CONSTRAINT fk_pincircle_pinid
	FOREIGN KEY(pinID)
		REFERENCES Pin(pinID)
);

CREATE TABLE PinPolygon
(
pinID INTEGER,
PolCoordinates POLYGON NOT NULL,
CONSTRAINT fk_pinpolygon_pinid
	FOREIGN KEY(pinID)
		REFERENCES Pin(pinID)
);
