import os

basedir = os.path.abspath(os.path.dirname(__file__))


class Config(object):
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'Hallo-Database_SQLite'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE URL') or 'sqlite:///' + os.path.join(basedir,
                                                                                            '../../Documents/TH-Köln/6. Semester/web1/downlloaded files/Sie koennten die Dokumente des Vortrags, der am 26_04_2022 stattfand/sqlite.db')
    SQLALCHEMY_TRACK_MODIFICATION = False
