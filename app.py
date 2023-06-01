from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db/database.db'
db = SQLAlchemy(app)

# Import and register your routes
from routes import *

if __name__ == '__main__':
    app.run()
