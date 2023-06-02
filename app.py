from flask import Flask, request, redirect, render_template
from flask_sqlalchemy import SQLAlchemy

import backend.lawsuit_model

db = SQLAlchemy()
app = Flask(__name__, template_folder='templates', static_folder='static')
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{"/home/wallaby/IdeaProjects/Ville_Montreal/db/database.db"}'

db.init_app(app)

with app.app_context():
    # This is where we initialize the application with the DB schema.
    db.create_all()


@app.route("/")
def home():
    return render_template("Frontend/index.html")


@app.route("/search", methods=["GET"])
def handle_search():
    search_criteria = request.args.get('search-criteria')
    search_input = request.args.get('search-input')

    if search_criteria == "etablissement":
        return redirect(f"/etablissement/{search_input}")
    elif search_criteria == "owner-name":
        return redirect(f"/owner-name/{search_input}")
    elif search_criteria == "street-name":
        return redirect(f"/street-name/{search_input}")
    else:
        return


# Handle invalid search criteria

@app.route("/etablissement/<search_input>", methods=["GET"])
def handle_etablissement(search_input):
    # Handle etablissement search
    return "Etablissement search results"


@app.route("/owner-name/<search_input>", methods=["GET"])
def handle_owner_name(search_input):
    # Handle owner name search
    return "Owner name search results"


@app.route("/street-name/<search_input>", methods=["GET"])
def handle_street_name(search_input):
    # Handle street name search
    return "Street name search results"


if __name__ == '__main__':
    app.run()
