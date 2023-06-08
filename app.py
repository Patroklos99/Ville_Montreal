import csv
import datetime

import requests
from flask import Flask, request, redirect, render_template, jsonify
from backend import lawsuit_model
from backend.database import db
from apscheduler.schedulers.background import BackgroundScheduler


app = Flask(__name__, template_folder='templates', static_folder='static')
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{"/home/wallaby/IdeaProjects/Ville_Montreal/db/database.db"}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['TEMPLATES_AUTO_RELOAD'] = True
app.config['JSON_AS_ASCII'] = False
db.init_app(app)

with app.app_context():
    db.create_all()  # initialize the application with the DB schema.


@app.route("/")
def home():
    return render_template("Frontend/index.html")


@app.route("/handle_search", methods=['GET', 'POST'])
def handle_search():
    if request.method == 'POST':
        search_criteria = request.form.get('search-criteria')
        search_input = request.form.get('search-input')

        if search_criteria == "establishment-name":
            return redirect(f"/etablissements/{search_input}")
        elif search_criteria == "owner-name":
            return redirect(f"/proprietaires/{search_input}")
        elif search_criteria == "street-name":
            return redirect(f"/adresses/{search_input}")
        else:
            return "Invalid search criteria"


# Handle invalid search criteria

@app.route("/etablissements/<etablissement>", methods=["GET"])
def get_etablissements(etablissement):
    results = lawsuit_model.Lawsuit.query.filter(lawsuit_model.Lawsuit.etablissement.ilike(f'%{etablissement}%')).all()
    # results = db.session.get(lawsuit_model.Lawsuit.etablissement == etablissement)
    print(results)
    return render_template("Frontend/results.html", results=results)


@app.route("/proprietaires/<proprietaire>", methods=["GET"])
def get_proprietaires(proprietaire):
    results = lawsuit_model.Lawsuit.query.filter(lawsuit_model.Lawsuit.proprietaire.ilike(f'%{proprietaire}%')).all()
    return render_template("Frontend/results.html", results=results)


@app.route("/adresses/<adresse>", methods=["GET"])
def get_rues(adresse):
    results = lawsuit_model.Lawsuit.query.filter(lawsuit_model.Lawsuit.adresse.ilike(f'%{adresse}%')).all()
    return render_template("Frontend/results.html", results=results)


def job_schedule():
    # Create a scheduler instance
    scheduler = BackgroundScheduler()

    # Define the job to be executed at midnight
    scheduler.add_job(update_db, 'cron', hour=23, minute=00)
    scheduler.start()


def update_db():
    url = 'https://data.montreal.ca/dataset/05a9e718-6810-4e73-8bb9-5955efeb91a0/resource/7f939a08-be8a-45e1-b208' \
          '-d8744dca8fc6/download/violations.csv'

    response = requests.get(url)
    content = response.content.decode('utf-8')
    _lawsuits = csv.DictReader(content.splitlines())

    # Update or insert records in the database
    with app.app_context():
        for lawsuit in _lawsuits:
            id_poursuite = lawsuit['id_poursuite']

            # Check if a record with the same id_poursuite exists in the database
            existing_record = lawsuit_model.Lawsuit.query.filter_by(id_poursuite=id_poursuite).first()

            if existing_record:
                # If a record exists, update the fields with the new values from the CSV file
                existing_record.buisness_id = lawsuit['business_id']
                existing_record.date = lawsuit['date']
                existing_record.description = lawsuit['description']
                existing_record.adresse = lawsuit['adresse']
                existing_record.date_jugement = lawsuit['date_jugement']
                existing_record.etablissement = lawsuit['etablissement']
                existing_record.montant = lawsuit['montant']
                existing_record.proprietaire = lawsuit['proprietaire']
                existing_record.ville = lawsuit['ville']
                existing_record.statut = lawsuit['statut']
                existing_record.date_statut = lawsuit['date_statut']
                existing_record.categorie = lawsuit['categorie']
            else:
                # If no record exists, create a new record in the database
                new_record = lawsuit_model.Lawsuit(
                    id_poursuite=id_poursuite,
                    buisness_id=lawsuit['business_id'],
                    date=lawsuit['date'],
                    description=lawsuit['description'],
                    adresse=lawsuit['adresse'],
                    date_jugement=lawsuit['date_jugement'],
                    etablissement=lawsuit['etablissement'],
                    montant=lawsuit['montant'],
                    proprietaire=lawsuit['proprietaire'],
                    ville=lawsuit['ville'],
                    statut=lawsuit['statut'],
                    date_statut=lawsuit['date_statut'],
                    categorie=lawsuit['categorie']
                )
                db.session.add(new_record)

        # Commit the changes to the database
        db.session.commit()


if __name__ == '__main__':
    job_schedule()
    app.run()
