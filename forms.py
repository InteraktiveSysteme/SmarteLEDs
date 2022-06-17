from flask import Flask
from wtforms import StringField
from flask_wtf import *
from wtforms.validators import DataRequired, Length


class registerForm():
    username = StringField("Your name has to be at least 5 Characters long", validators=[DataRequired()])
    password = StringField("Your name has to be at least 5 Characters long", validators=[Length(5,120,"Password has to be at least 5 Characters long")])