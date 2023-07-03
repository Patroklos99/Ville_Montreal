import csv
import requests
import yaml
import smtplib
import dicttoxml

from flask import Flask, request, redirect, render_template, jsonify, Response, current_app
from backend import lawsuit_model
from backend.database import db
from apscheduler.schedulers.background import BackgroundScheduler
from flask_swagger_ui import get_swaggerui_blueprint
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from utils import auth_required

from jsonschema import validate
from json_schema import inspection_schema

app = Flask(__name__, template_folder='templates', static_folder='static')
SWAGGER_URL = '/api/docs'  # URL for exposing Swagger UI (without trailing '/')
API_URL = '/static/swagger.yaml'  # Our API url (can of course be a local resource)

# Call factory function to create our blueprint
swaggerui_blueprint = get_swaggerui_blueprint(
    SWAGGER_URL,  # Swagger UI static files will be mapped to '{SWAGGER_URL}/dist/'
    API_URL,
    config={  # Swagger UI config overrides
        'app_name': "Test application"
    },
    # oauth_config={  # OAuth config. See https://github.com/swagger-api/swagger-ui#oauth2-configuration .
    #    'clientId': "your-client-id",
    #    'clientSecret': "your-client-secret-if-required",
    #    'realm': "your-realms",
    #    'appName': "your-app-name",
    #    'scopeSeparator': " ",
    #    'additionalQueryStringParams': {'test': "hello"}
    # }
)

app.register_blueprint(swaggerui_blueprint)

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
        search_data = request
        search_criteria = search_data.form.get('search-criteria')
        search_input = search_data.form.get('search-input')

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
    print(results)
    return render_template("Frontend/results.html", results=results)


@app.route("/proprietaires/<proprietaire>", methods=["GET"])
def get_proprietaires(proprietaire):
    results = lawsuit_model.Lawsuit.query.filter(lawsuit_model.Lawsuit.proprietaire.ilike(f'%{proprietaire}%')).all()
    if results:
        return render_template("Frontend/results.html", results=results)
    else:
        return render_template("not_found.html")


@app.route("/adresses/<adresse>", methods=["GET"])
def get_rues(adresse):
    results = lawsuit_model.Lawsuit.query.filter(lawsuit_model.Lawsuit.adresse.ilike(f'%{adresse}%')).all()
    return render_template("Frontend/results.html", results=results)


@app.route("/contrevenants", methods=["GET", "POST"])
def get_contrevenants():
    date_debut = request.json.get("date1")
    date_fin = request.json.get("date2")

    # Filtrer les contraventions entre les deux dates spécifiées
    results = lawsuit_model.Lawsuit.query.filter(lawsuit_model.Lawsuit.date.between(date_debut, date_fin)).all()

    # Convertir les résultats en liste de dictionnaires
    result = [lawsuit.to_dict() for lawsuit in results]

    return jsonify(result)


@app.route("/contrevenants-restaurant", methods=["POST"])
def get_contrevenants_restaurant():
    date_debut = request.json.get("date1")
    date_fin = request.json.get("date2")
    restaurant = request.json.get("restaurant")

    # Filtrer les contraventions du restaurant entre les deux dates spécifiées
    results = lawsuit_model.Lawsuit.query.filter(
        lawsuit_model.Lawsuit.etablissement == restaurant,
        lawsuit_model.Lawsuit.date.between(date_debut, date_fin)
    ).all()

    # Obtenir uniquement les descriptions des contraventions
    descriptions = [lawsuit.to_dict() for lawsuit in results]

    return jsonify(descriptions)


# Return all companies with atleast one infraction in desc order
@app.route("/etablissements/infractions", methods=["GET"])
def get_etablissements_infractions():
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
@app.route("/etablissements/infractionsXML", methods=["GET"])
def get_etablissements_infractions_xml():
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


@app.route("/etablissements/infractionsCSV", methods=["GET"])
def get_etablissements_infractions_csv():
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

    # Set the response headers
    headers = {
        "Content-Disposition": "attachment; filename=etablissements_infractions.csv",
        "Content-Type": "text/csv; charset=utf-8"
    }

    return Response(csv_data, headers=headers)


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

        # Send email with the list of new violations
    if new_violations:
        email_recipient = get_email_recipient()
        email_subject = 'New Violations Detected'
        email_body = '\n'.join([f'- {violation["description"]}' for violation in new_violations])

        send_email(email_recipient, email_subject, email_body)
    # Commit the changes to the database
    db.session.commit()


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


# @app.route('/doc')
# def documentation():
#     # Read the RAML file and pass it to the template
#     raml_f = "api_doc.raml"
#     with open(raml_f, 'r') as raml_file:
#         raml_content = raml_file.read()
#     return render_template('Frontend/api_doc.html', raml_content=raml_content)


@app.route("/demande-inspection", methods=["POST", "GET"])
def create_inspection_request():
    data = request.get_json()

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


@app.route("/contrevenants/<string:etablissement>", methods=["PUT", "DELETE"])
def update_or_delete_lawsuit(etablissement):
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

        return jsonify({"message": f"Lawsuits for establishment {etablissement} updated successfully."})

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Failed to update lawsuits for establishment {etablissement}."}), 500


def delete_lawsuits(etablissement):
    try:
        lawsuits = lawsuit_model.Lawsuit.query.filter_by(etablissement=etablissement).all()

        for lawsuit in lawsuits:
            db.session.delete(lawsuit)

        db.session.commit()

        return jsonify({"message": f"Lawsuits for establishment {etablissement} deleted successfully."})

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Failed to delete lawsuits for establishment {etablissement}."}), 500


@app.route("/login")
@auth_required
def login():
    return jsonify({"message": f"You have successfully logged in"})


if __name__ == '__main__':
    job_schedule()
    app.run()
