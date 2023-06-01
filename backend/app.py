from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os

# Create an instance of SQLAlchemy
db = SQLAlchemy()

app = Flask(__name__)
db_path = os.path.join(os.path.dirname(__file__), 'db', 'database.db')
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'

# Associate db with the Flask app
db.init_app(app)

with app.app_context():
    import lawsuit_model  # Import your model here after initializing app context.

    @app.route("/")
    def home():
        test = lawsuit_model.Lawsuit.query.all()  # Query all records.
        return str(test)


if __name__ == '__main__':
    app.run()
