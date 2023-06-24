import csv
import datetime

import requests
from flask import Flask, request, redirect, render_template, jsonify
from flask_restx import Api, Resource
from backend import lawsuit_model
from backend.database import db
from apscheduler.schedulers.background import BackgroundScheduler
from flask_swagger_ui import get_swaggerui_blueprint

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


# Single Page App return of json
# @app.route("/etablissements/<etablissement>", methods=["GET"])
# def get_etablissements(etablissement):
#     results = lawsuit_model.Lawsuit.query.filter(lawsuit_model.Lawsuit.etablissement.ilike(f'%{etablissement}%')).all()
#     serialized_results = [lawsuit.to_dict() for lawsuit in results]
#     return jsonify(serialized_results)

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

# from flask import Flask
# from flask_restx import Api, Resource, fields
#
# app = Flask(__name__)
# api = Api(app, version='1.0', title='TodoMVC API',
#           description='Description here',
#           )
#
# ns = api.namespace('Animals', description='Animal operations')
#
# animal = api.model('Animals', {
#     'id': fields.Integer(readonly=True, description='The task unique identifier'),
# })
#
#
# class TodoDAO(object):
#     def __init__(self):
#         self.counter = 0
#         self.todos = []
#
#     def get(self, id):
#         for todo in self.todos:
#             if todo['id'] == id:
#                 return todo
#         api.abort(404, "Todo {} doesn't exist".format(id))
#
#     def create(self, data):
#         todo = data
#         todo['id'] = self.counter = self.counter + 1
#         self.todos.append(todo)
#         return todo
#
#     def update(self, id, data):
#         todo = self.get(id)
#         todo.update(data)
#         return todo
#
#     def delete(self, id):
#         todo = self.get(id)
#         self.todos.remove(todo)
#
#
# DAO = TodoDAO()
#
#
# @ns.route('/')
# class TodoList(Resource):
#     @ns.marshal_list_with(animal)
#     def get(self):
#         '''List all tasks'''
#         return DAO.todos
#
#     @ns.expect(animal)
#     @ns.marshal_with(animal, code=201)
#     def post(self):
#         '''Create a new task'''
#         return DAO.create(api.payload), 201
#
#
# @ns.route('/<int:id>')
# @ns.response(404, 'Todo not found')
# @ns.param('id', 'The task identifier')
# class Todo(Resource):
#     '''Show a single todo item and lets you delete them'''
#     @ns.marshal_with(animal)
#     def get(self, id):
#         '''Fetch a given resource'''
#         return DAO.get(id)
#
#     @ns.response(204, 'Todo deleted')
#     def delete(self, id):
#         '''Delete a task given its identifier'''
#         DAO.delete(id)
#         return '', 204
#
#     @ns.expect(animal)
#     @ns.marshal_with(animal)
#     def put(self, id):
#         '''Update a task given its identifier'''
#         return DAO.update(id, api.payload)
#
#
# if __name__ == '__main__':
#     app.run(debug=True)
