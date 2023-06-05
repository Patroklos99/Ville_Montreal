from flask import Flask, request, redirect, render_template, jsonify
from backend import lawsuit_model
from backend.database import db

app = Flask(__name__, template_folder='templates', static_folder='static')
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{"/home/wallaby/IdeaProjects/Ville_Montreal/db/database.db"}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
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
            return redirect(f"/rues/{search_input}")
        else:
            return "Invalid search criteria"


# Handle invalid search criteria

@app.route("/etablissements/<etablissement>", methods=["GET"])
def get_etablissements(etablissement):
    results = lawsuit_model.Lawsuit.query.filter(lawsuit_model.Lawsuit.etablissement.ilike(f'%{etablissement}%')).all()
    if results:
        return jsonify([result.to_dict() for result in results])
    else:
        return jsonify({"error": "No result found"}), 404


@app.route("/proprietaires/<proprietaire>", methods=["GET"])
def get_proprietaires(proprietaire):
    results = lawsuit_model.Lawsuit.query.filter(lawsuit_model.Lawsuit.proprietaire.ilike(f'%{proprietaire}%')).all()
    if results:
        return jsonify([result.to_dict() for result in results])
    else:
        return jsonify({"error": "No result found"}), 404

@app.route("/rues/<rue>", methods=["GET"])
def get_rues(search_input):
    # Handle street name search
    return "Street name search results"


if __name__ == '__main__':
    app.run()
