from app import app
from lawsuit_model import Lawsuit


@app.route("/")
def home():
    lawsuits = Lawsuit.query.all()
    return str(lawsuits)
