from flask import Flask
from flaskext.markdown import Markdown
#from flask_sqlalchemy import SQLAlchemy
#from flask_migrate import Migrate

from views import app

def create_app():
    mapp = Flask(__name__)
    Markdown(mapp)
    mapp.config.from_object('config.DevelopmentConfig')
    mapp.register_blueprint(app)
#    db = SQLAlchemy(mapp)
#    migrate = Migrate(mapp, db)


    return mapp

if __name__ == '__main__':
    create_app().run()





