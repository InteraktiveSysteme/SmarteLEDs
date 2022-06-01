from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager, UserMixin, login_user, login_required, current_user
from werkzeug.security import  check_password_hash, generate_password_hash


app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///SQLTerror.db'
app.config['SQLALCHEMY_TRACK_MODIFICATION'] = True
app.config['SQLALCHEMY_ECHO'] = True

db = SQLAlchemy(app)
migrate = Migrate(app, db)



class User(db.Model):
    userID =db.Column(db.Integer(),primary_key=True)
    username =db.Column(db.String(100),unique=True)
    password_hash = db.Column(db.String(128))

    @property
    def password(self):
        raise AttributeError('Password is not readable')

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password_hash,password)

    def __repr__(self):
        return "User'{}'>".format(self.username)

from app import routes