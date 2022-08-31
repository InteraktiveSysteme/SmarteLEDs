import os
from . import app

basedir = os.path.abspath(os.path.dirname(__file__))

class Config(object):
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///SQLTerror.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = True
    SECRET_KEY = os.urandom(12)
    UPLOAD_FOLDER = app.root_path + "/static/lamps"
    RENDER_FOLDER = app.root_path + "/static/renders"
