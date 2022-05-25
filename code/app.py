from flask import Flask
from flaskext.markdown import Markdown

from views import app

def create_app():
    mapp = Flask(__name__)
    Markdown(mapp)
    mapp.config.from_object('config.DevelopmentConfig')
    mapp.register_blueprint(app)

    return mapp

if __name__ == '__main__':
    create_app().run()





