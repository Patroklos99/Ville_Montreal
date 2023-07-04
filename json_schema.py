inspection_schema = {
    "type": "object",
    "properties": {
        "etablissement": {"type": "string"},
        "adresse": {"type": "string"},
        "ville": {"type": "string"},
        "date_visite": {"type": "string", "format": "date"},
        "client_nom": {"type": "string"},
        "client_prenom": {"type": "string"},
        "description_probleme": {"type": "string"}
    },
    "required": ["etablissement", "adresse", "ville", "date_visite", "client_nom", "client_prenom",
                 "description_probleme"]
}

user_schema = {
    "type": "object",
    "properties": {
        "full_name": {"type": "string"},
        "email": {"type": "string", "format": "email"},
        "establishments": {"type": "array", "items": {"type": "string"}},
        "password": {"type": "string"}
    },
    "required": ["full_name", "email", "establishments", "password"]
}
