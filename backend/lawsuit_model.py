from datetime import datetime
from app import db


class Lawsuit(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    id_poursuite = db.Column(db.String(255))
    buisness_id = db.Column(db.String(255))
    date = db.Column(db.DateTime, default=datetime.utcnow)
    description = db.Column(db.String(255))
    adresse = db.Column(db.String(255))
    date_jugement = db.Column(db.DateTime)
    etablissement = db.Column(db.String(255))
    montant = db.Column(db.Float)
    proprietaire = db.Column(db.String(255))
    ville = db.Column(db.String(255))
    statut = db.Column(db.String(255))
    date_statut = db.Column(db.DateTime)
    categorie = db.Column(db.String(255))

    def __repr__(self):
        return f"<Lawsuit {self.id}>"
