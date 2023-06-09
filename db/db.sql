CREATE TABLE lawsuits
(
    id_poursuite  INTEGER PRIMARY KEY,
    buisness_id   INTEGER,
    date          TEXT,
    description   TEXT,
    adresse       VARCHAR(200),
    date_jugement TEXT,
    etablissement varchar(100),
    montant       INTEGER CHECK (montant >= 0),
    proprietaire  varchar(100),
    ville         varchar(50),
    statut        varchar(50),
    date_statut   TEXT,
    categorie     varchar(100)
);

CREATE TABLE users
(
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name      VARCHAR(255) NOT NULL,
    email          VARCHAR(255) NOT NULL,
    establishments TEXT,
    password       VARCHAR(255) NOT NULL,
    profile_photo  BLOB
);