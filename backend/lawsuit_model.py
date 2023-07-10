from backend.database import db


class Lawsuit(db.Model):
    __tablename__ = 'lawsuits'

    id_poursuite = db.Column(db.Integer, primary_key=True)
    buisness_id = db.Column(db.Integer)
    date = db.Column(db.Text)
    description = db.Column(db.String(255))
    adresse = db.Column(db.String(200))
    date_jugement = db.Column(db.Text)
    etablissement = db.Column(db.String(100))
    montant = db.Column(db.Integer)
    proprietaire = db.Column(db.String(100))
    ville = db.Column(db.String(50))
    statut = db.Column(db.String(50))
    date_statut = db.Column(db.Text)
    categorie = db.Column(db.String(100))

    def __repr__(self):
        return f"<Lawsuit {self.id_poursuite}>"

    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
