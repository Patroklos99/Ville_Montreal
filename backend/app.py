from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import lawsuit_model

db = SQLAlchemy()
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{"/home/wallaby/IdeaProjects/Ville_Montreal/db/database.db"}'

db.init_app(app)

with app.app_context():
    # This is where we initialize the application with the DB schema.
    db.create_all()


@app.route("/")
def home():
    etablissements = db.session.query(lawsuit_model.Lawsuit.etablissement).filter(lawsuit_model.Lawsuit.ville == 'LaSalle').all()

    # Create a string with each etablissement value on a separate line
    result = '\n'.join(etablissement[0] for etablissement in etablissements)

    # Return the result
    return result.split('\n')


if __name__ == '__main__':
    app.run()
