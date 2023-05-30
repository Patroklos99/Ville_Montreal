CREATE TABLE lawsuits
(
    id_poursuite  INTEGER,
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