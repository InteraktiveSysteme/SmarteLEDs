from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager
from config import Config


app = Flask(__name__)
app.config.from_object(Config)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///SQLTerror.db'
app.config['SQLALCHEMY_TRACK_MODIFICATION'] = True
app.config['SQLALCHEMY_ECHO'] = True

db = SQLAlchemy(app)
migrate = Migrate(app, db)
"""
login = LoginManager(app)
login.login_view = 'login'

"""
class User(db.Model):
    userID =db.Column(db.Integer(),primary_key=True)
    username =db.Column(db.String(100),unique=True)
    password =db.Column(db.String(200))

    def __repr__(self):
        return "User'{}'>".format(self.username)
