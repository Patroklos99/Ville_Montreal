import base64
import csv
import requests
import yaml
import smtplib
import dicttoxml
import json

from flask import Flask, request, redirect, render_template, jsonify, Response, url_for, session, make_response
from flask_restx import Resource, Api

from backend.database import db
from datetime import datetime
from backend import lawsuit_model
from backend import user_model
from apscheduler.schedulers.background import BackgroundScheduler
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask_cors import CORS
from utils import auth_required

from jsonschema import validate
from json_schema import inspection_schema

app = Flask(__name__, template_folder='templates', static_folder='static')
CORS(app)
app.config.from_prefixed_env()

app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{"/home/wallaby/IdeaProjects/Ville_Montreal/db/database.db"}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['TEMPLATES_AUTO_RELOAD'] = True
app.config['JSON_AS_ASCII'] = False
app.config['SECRET_KEY'] = 'a21312mkldas23423oa'  # Set a secret key for the session
app.config['SESSION_TYPE'] = 'filesystem'  # Use filesystem-based session storage
db.init_app(app)

api = Api(app, doc="/api")

with app.app_context():
    db.create_all()  # initialize the application with the DB schema.


@api.route("/home")
class Home(Resource):
    def get(self):
        response = make_response(render_template("Frontend/index.html"))
        response.headers["Content-Type"] = "text/html"
        return response


@api.route("/handle_search", methods=['GET'])
class Handle_search(Resource):
    def get(self):
        search_data = request
        search_criteria = search_data.args.get('search-criteria')
        search_input = search_data.args.get('search-input')

        if search_criteria == "establishment-name":
            return redirect(f"/etablissements/{search_input}")
        elif search_criteria == "owner-name":
            return redirect(f"/proprietaires/{search_input}")
        elif search_criteria == "street-name":
            return redirect(f"/adresses/{search_input}")
        else:
            return {"Invalid search criteria"}


# Handle invalid search criteria
@api.route("/etablissements/<string:etablissement>", methods=["GET"])
class Etablissement(Resource):
    def get(self, etablissement):
        results = lawsuit_model.Lawsuit.query.filter(
            lawsuit_model.Lawsuit.etablissement.ilike(f'%{etablissement}%')).all()
        response = make_response(render_template("Frontend/results.html", results=results))
        response.headers["Content-Type"] = "text/html"
        return response


@api.route("/proprietaires/<proprietaire>", methods=["GET"])
class Proprietaires(Resource):
    def get(self, proprietaire):
        results = lawsuit_model.Lawsuit.query.filter(
            lawsuit_model.Lawsuit.proprietaire.ilike(f'%{proprietaire}%')).all()
        response = make_response(render_template("Frontend/results.html", results=results))
        response.headers["Content-Type"] = "text/html"
        return response


@api.route("/adresses/<adresse>", methods=["GET"])
class Rues(Resource):
    def get(self, adresse):
        results = lawsuit_model.Lawsuit.query.filter(lawsuit_model.Lawsuit.adresse.ilike(f'%{adresse}%')).all()
        response = make_response(render_template("Frontend/results.html", results=results))
        response.headers["Content-Type"] = "text/html"
        return response


@app.route("/contrevenants", methods=["GET", "POST"])
def get_contrevenants():
    date_debut = request.json.get("date1")
    date_fin = request.json.get("date2")

    # Filtrer les contraventions entre les deux dates spécifiées
    results = lawsuit_model.Lawsuit.query.filter(lawsuit_model.Lawsuit.date.between(date_debut, date_fin)).all()

    # Convertir les résultats en liste de dictionnaires
    result = [lawsuit.to_dict() for lawsuit in results]

    return jsonify(result)


@api.route("/contrevenants-restaurant/<date1>/<date2>/<restaurant>", methods=["GET"])
class Contrevenants(Resource):
    def get(self, date1, date2, restaurant):
        # date_debut = request.args.get("date1")
        # date_fin = request.args.get("date2")
        # restaurant = request.args.get("restaurant")

        # Filtrer les contraventions du restaurant entre les deux dates spécifiées
        results = lawsuit_model.Lawsuit.query.filter(
            lawsuit_model.Lawsuit.etablissement == restaurant,
            lawsuit_model.Lawsuit.date.between(date1, date2)
        ).all()

        # Obtenir uniquement les descriptions des contraventions
        descriptions = [lawsuit.to_dict() for lawsuit in results]

        return jsonify(descriptions)


# Return all companies with atleast one infraction in desc order
@api.route("/etablissements/infractionsJSON", methods=["GET"])
class Infractions(Resource):

    def get(self):
        # Effectuer la requête pour obtenir la liste triée des établissements avec le nombre d'infractions
        results = db.session.query(lawsuit_model.Lawsuit.etablissement,
                                   db.func.count(lawsuit_model.Lawsuit.id_poursuite).label("nombre_infractions")) \
            .group_by(lawsuit_model.Lawsuit.etablissement) \
            .order_by(db.func.count(lawsuit_model.Lawsuit.id_poursuite).desc()) \
            .all()

        # Convertir les résultats en liste de dictionnaires
        result = [{"etablissement": etablissement, "nombre_infractions": nombre_infractions} for
                  etablissement, nombre_infractions in results]

        return jsonify(result)


# Return all companies with at least one infraction in descending order
@api.route("/etablissements/infractionsXML", methods=["GET"])
class InfractionsXml(Resource):
    def get(self):
        # Perform the query to get the sorted list of establishments with the number of infractions
        results = db.session.query(
            lawsuit_model.Lawsuit.etablissement,
            db.func.count(lawsuit_model.Lawsuit.id_poursuite).label("nombre_infractions")
        ).group_by(lawsuit_model.Lawsuit.etablissement).order_by(
            db.func.count(lawsuit_model.Lawsuit.id_poursuite).desc()).all()

        # Convert the results to a list of dictionaries
        result = [
            {"etablissement": etablissement, "nombre_infractions": nombre_infractions}
            for etablissement, nombre_infractions in results
        ]

        # Convert the result to XML format with UTF-8 encoding
        xml_data = dicttoxml.dicttoxml(result, custom_root="etablissements", attr_type=False, encoding="utf-8")

        # Set the response content type as XML
        response = Response(response=xml_data, status=200, mimetype="application/xml")

        return response


@api.route("/etablissements/infractionsCSV", methods=["GET"])
class InfractionsCSV(Resource):
    def get(self):
        # Perform the query to get the sorted list of establishments with the number of infractions
        results = db.session.query(lawsuit_model.Lawsuit.etablissement,
                                   db.func.count(lawsuit_model.Lawsuit.id_poursuite).label("nombre_infractions")) \
            .group_by(lawsuit_model.Lawsuit.etablissement) \
            .order_by(db.func.count(lawsuit_model.Lawsuit.id_poursuite).desc()) \
            .all()

        # Create the CSV content
        csv_data = "etablissement,nombre_infractions\n"
        for etablissement, nombre_infractions in results:
            csv_data += f"{etablissement},{nombre_infractions}\n"

        # Create a response with the CSV data
        response = make_response(csv_data)

        # Set the content type header to indicate CSV
        response.headers["Content-Type"] = "text/csv; charset=utf-8"
        return response


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
    new_violations = []

    # Update or insert records in the database
    with app.app_context():
        for lawsuit in _lawsuits:
            id_poursuite = lawsuit['id_poursuite']

            existing_record = lawsuit_model.Lawsuit.query.filter_by(id_poursuite=id_poursuite).first()
            if not existing_record:
                new_violations.append(lawsuit)

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

        # Send email with the list of new violations
    if new_violations:
        email_recipient = get_email_recipient()
        email_subject = 'New Violations Detected'
        email_body = '\n'.join([f'- {violation["description"]}' for violation in new_violations])

        send_email(email_recipient, email_subject, email_body)

    # Notify users of new violations
    if new_violations:
        establishments = set(lawsuit['etablissement'] for lawsuit in new_violations)
        for establishment in establishments:
            notify_users_of_new_violation(establishment)


def notify_users_of_new_violation(establishment):
    users = user_model.User.query.filter(user_model.User.establishments.ilike(f"%{establishment}%")).all()

    for user in users:
        email = user.email
        subject = f"New Violation Detected at {establishment}"
        body = f"Dear {user.full_name},\n\nA new violation has been detected at {establishment}.\n\nPlease take " \
               f"appropriate action.\n\nRegards,\nThe Monitoring System"

        send_email(email, subject, body)


def send_email(recipient, subject, body):
    # Email configuration
    sender = 'test@gmail.com'
    smtp_server = 'smtp.example.com'
    smtp_port = 587
    smtp_username = 'your_username'
    smtp_password = 'your_password'

    # Create a multipart message
    message = MIMEMultipart()
    message['From'] = sender
    message['To'] = recipient
    message['Subject'] = subject

    # Attach the email body as plain text
    message.attach(MIMEText(body, 'plain'))

    # Send the email
    with smtplib.SMTP(smtp_server, smtp_port) as server:
        server.starttls()
        server.login(smtp_username, smtp_password)
        server.send_message(message)
        server.quit()


def get_email_recipient():
    with open('config.yml', 'r') as config_file:
        config = yaml.safe_load(config_file)
        return config['email']['recipient']


@api.route(
    "/demande-inspection/<string:establishment>/<string:address>/<string:city>/<string:visit_date>/<string"
    ":client_name>/<string:client_surname>/<string:description>",
    methods=["POST"])
class DemandeInspection(Resource):
    def post(self, establishment, address, city, visit_date, client_name, client_surname, description):
        data = {
            "etablissement": establishment,
            "adresse": address,
            "ville": city,
            "date_visite": visit_date,
            "client_nom": client_name,
            "client_prenom": client_surname,
            "description_probleme": description
        }

        # Validate the JSON data against the schema
        try:
            validate(data, inspection_schema)
        except Exception as e:
            return jsonify({"error": str(e)}), 400

        # Process the inspection request and return a response (implementation logic)
        return jsonify({"message": "Inspection request created successfully"})


@app.route("/inspection-requests/<id>", methods=["DELETE"])
def delete_inspection_request(id):
    # Perform the deletion logic based on the provided ID
    # If the deletion is successful, return a response indicating success
    return jsonify({"message": f"Inspection request with ID {id} deleted successfully"})


@api.route("/contrevenants/<string:etablissement>", methods=["PUT", "DELETE"])
class LawsuitsOperations(Resource):
    def update_or_delete_lawsuit(self, etablissement):
        if request.method == "PUT":
            return update_lawsuits(etablissement)
        elif request.method == "DELETE":
            return delete_lawsuits(etablissement)
        else:
            return jsonify({"message": "Method not allowed."}), 405


def update_lawsuits(etablissement):
    updated_etablissement = request.json.get("updated_etablissement")

    try:
        lawsuits = lawsuit_model.Lawsuit.query.filter_by(etablissement=etablissement).all()

        for lawsuit in lawsuits:
            lawsuit.etablissement = updated_etablissement

        db.session.commit()

        return jsonify({"message": f"lawsuit_model.Lawsuit for establishment {etablissement} updated successfully."})

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Failed to update lawsuits for establishment {etablissement}."}), 500


def delete_lawsuits(etablissement):
    try:
        lawsuits = lawsuit_model.Lawsuit.query.filter_by(etablissement=etablissement).all()

        for lawsuit in lawsuits:
            db.session.delete(lawsuit)

        db.session.commit()

        return jsonify({"message": f"lawsuit_model.Lawsuit for establishment {etablissement} deleted successfully."})

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Failed to delete lawsuits for establishment {etablissement}."}), 500


@api.route("/user")
class User(Resource):
    def get(self):
        email = session.get('email')
        user = user_model.User.query.filter_by(email=email).first()
        establishments = user.establishments.split(",") if user.establishments else []
        response = make_response(render_template("Frontend/user.html", user=user, establishments=establishments))
        response.headers["Content-Type"] = "text/html"
        return response


@api.route("/login/<string:email>/<string:password>", methods=["GET"])
class Login(Resource):
    def get(self, email, password):
        user = user_model.User.query.filter_by(email=email).first()

        if user and user.password == password:
            # return jsonify({"message": "You have successfully logged in"})
            session['email'] = email  # Set the email in the session
            return redirect(url_for("user"))
        else:
            return jsonify({"error": f"Invalid email or password"}), 400


@app.route("/users/create", methods=['POST'])  ###here
def create_user():
    data = request.get_json()

    # try:
    #     validate(data, user_schema)  # Validate the JSON data against the schema
    # except ValidationError as e:
    #     print("error aca")
    #     return jsonify({'error': str(e)}), 400

    full_name = data.get('full_name')
    email = data.get('email')
    establishments = data.get('establishments')
    password = data.get('password')

    # Check if the email already exists
    existing_user = user_model.User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({'error': 'Email already exists'}), 400

    try:
        user = user_model.User(full_name=full_name, email=email, establishments=establishments, password=password)
        db.session.add(user)
        db.session.commit()
        return jsonify({'message': 'User created successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@api.route("/establishments")
class EstablishmentsAll(Resource):
    def get(self):
        establishments = lawsuit_model.Lawsuit.query.with_entities(lawsuit_model.Lawsuit.etablissement).distinct().all()
        establishment_names = [est[0] for est in establishments]
        return jsonify({"establishments": establishment_names})


# @api.route("/modify_user_establishments/<string:etablissement>", methods=["POST", "DELETE"])
# class ModifyUserEstablishments(Resource):
#     def post(self, etablissement):
#         return add_establishment(etablissement)
#
#     def delete(self, etablissement):
#         return delete_establishment(etablissement)


@app.route("/modify_user_establishments/<string:etablissement>", methods=["POST", "DELETE"])
def update_or_delete_establishment(etablissement):
    if request.method == "POST":
        return add_establishment(etablissement)
    elif request.method == "DELETE":
        return delete_establishment(etablissement)
    else:
        return jsonify({"message": "Method not allowed."}), 405


def add_establishment(etablissement):
    email = session.get("email")

    try:
        user = user_model.User.query.filter_by(email=email).first()
        if not user:
            return jsonify({"message": "User not found."}), 404

        establishments = user.establishments.split(",") if user.establishments else []

        if etablissement in establishments:
            return jsonify({"message": f"Establishment {etablissement} already exists."}), 400

        isInDB = lawsuit_model.Lawsuit.query.filter_by(etablissement=etablissement).first()

        if not isInDB:
            return jsonify({"message": f"Establishment {etablissement} provided is not valid."}), 400

        establishments.append(etablissement)
        user.establishments = ",".join(establishments)
        db.session.commit()

        return jsonify({"establishments": establishments})
        # return jsonify({"message": f"New establishment {etablissement} added successfully."})

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Failed to add new establishment."}), 500


def delete_establishment(etablissement):
    email = session.get("email")

    try:
        user = user_model.User.query.filter_by(email=email).first()
        establishments = user.establishments.split(",") if user.establishments else []

        if etablissement in establishments:
            establishments.remove(etablissement)
            user.establishments = ",".join(establishments)
            db.session.commit()
            return jsonify({"establishments": establishments})
        else:
            return jsonify({"message": f"Establishment {etablissement} not found."}), 404

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Failed to delete establishment {etablissement}."}), 500


@app.route("/upload-photo", methods=["POST"])
def upload_photo():
    file = request.files.get("photo")
    email = session.get("email")

    if file:
        file_data = file.read()
        user = user_model.User.query.filter_by(email=email).first()

        # Update the user's profile photo in the database
        user.profile_photo = file_data
        db.session.commit()

        # Construct the data URL for the image
        encoded_data = base64.b64encode(file_data).decode("utf-8")
        data_url = "data:image/jpeg;base64," + encoded_data

        # Return the data URL
        return jsonify({"imageUrl": data_url})
    else:
        return jsonify({"error": "No file received."}), 400


@app.route('/get_profile_photo')
def get_profile_photo():
    email = session.get("email")
    user = user_model.User.query.filter_by(email=email).first()
    if user and user.profile_photo:
        # Construct the data URL for the image
        encoded_data = base64.b64encode(user.profile_photo).decode("utf-8")
        data_url = "data:image/jpeg;base64," + encoded_data

        # Return the data URL

        return jsonify({"imageUrl": data_url})

    # If the user does not have a profile photo, return the URL of the default photo
    default_photo_url = url_for('static', filename='images/Default_pfp.svg.png')
    return jsonify({"imageUrl": default_photo_url})


if __name__ == '__main__':
    job_schedule()
    app.run()
