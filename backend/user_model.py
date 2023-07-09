from app import db


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    establishments = db.Column(db.String)
    password = db.Column(db.String(255), nullable=False)
    profile_photo = db.Column(db.LargeBinary, nullable=True)

    def __repr__(self):
        return f"<User(id={self.id}, full_name='{self.full_name}', email='{self.email}')>"

    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
