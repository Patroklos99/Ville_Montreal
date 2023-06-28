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
    "required": ["etablissement", "adresse", "ville", "date_visite", "client_nom", "client_prenom", "description_probleme"]
}
