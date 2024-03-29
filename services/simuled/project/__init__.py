#Authors: Lukas Decker, Lucas Haupt, Samuel Haeseler, David Mertens, Alisa Ruege
from ctypes import addressof
from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_login import *
from flask_bootstrap import Bootstrap
from datetime import datetime
import os
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.middleware.proxy_fix import ProxyFix

app = Flask(__name__)
app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_host=1)
app.config.from_object("project.config.Config")
app.config['UPLOAD_FOLDER'] = os.path.join(app.root_path, 'static/lamps/')
Bootstrap(app)
db = SQLAlchemy(app)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "index"

@login_manager.user_loader
def load_user(userID):
    return User.query.get(int(userID))

class Cart(db.Model):
    cartID = db.Column(db.Integer(), primary_key=True)
    userID = db.Column(db.Integer())
    lampID = db.Column(db.Integer())
    amount = db.Column(db.Integer())
    timeStamp = db.Column(db.DateTime, default=datetime.utcnow, unique=False)


class User(db.Model, UserMixin):
    userID = db.Column(db.Integer(), primary_key=True)
    userName = db.Column(db.String(100), unique=False, nullable=False)
    passwordHash = db.Column(db.String(120))
    timeStamp = db.Column(db.DateTime, default=datetime.utcnow, unique=False)
    admin = db.Column(db.Boolean)
    firstName =  db.Column(db.String(200))
    lastName =  db.Column(db.String(200))
    country =  db.Column(db.String(200))
    address =  db.Column(db.String(200))
    postalCode =  db.Column(db.String(200))

    @property
    def password(self):
        raise AttributeError('Password is not a readable Attribute')

    @password.setter
    def password(self, password):
        self.passwordHash = generate_password_hash(password)

    def verifyPassword(self, password):
        return check_password_hash(self.passwordHash, password)

    def get_id(self):
        return (self.userID)

    def __repr__(self):
        return "<User'{}'>".format(self.userName)


class Render(db.Model):
    renderID = db.Column(db.Integer(), primary_key=True)
    userID = db.Column(db.Integer(), unique=False)
    renderName = db.Column(db.String(100), unique=False)
    timeStamp = db.Column(db.DateTime, default=datetime.utcnow, unique=False)
    imgName = db.Column(db.String(1000), unique=False)
    renderText = db.Column(db.String(1000), unique=False)
    def __repr__(self):
        return "<User'{}'>".format(self.lampName)


class Lamp(db.Model):
    lampID = db.Column(db.Integer(), primary_key=True)
    lampName = db.Column(db.String(100), unique=False)
    timeStamp = db.Column(db.DateTime, default=datetime.utcnow, unique=False)
    imgName = db.Column(db.String(1000), unique=False)
    gltfName = db.Column(db.String(1000), unique=False)
    lampText = db.Column(db.String(1000), unique=False)
    lampLongText = db.Column(db.String(10000), unique=False)
    userKeyID = db.Column(db.Integer(), db.ForeignKey('user.userID'))

    lampPrice = db.Column(db.Integer(), unique=False)

    def __repr__(self):
        return "<User'{}'>".format(self.lampName)

import project.routes

if __name__ == '__main__':
    print(__name__)
    print("*******************************************+")
    app.run()
