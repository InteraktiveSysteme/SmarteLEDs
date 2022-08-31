import random

from flask import Flask, render_template, request, flash
from flask import render_template
from werkzeug.utils import secure_filename
import uuid as uuid
import os
from flask_wtf import FlaskForm
from wtforms import EmailField, StringField, PasswordField, SubmitField, FileField, IntegerField, DecimalField, TextAreaField, BooleanField
from wtforms.validators import *


class AddLampForm(FlaskForm):
    name = StringField("Name", validators=[DataRequired()])
    shortText = StringField("Short Description", validators=[DataRequired()])
    longText = TextAreaField("Long Description", validators=[DataRequired()])
    price = DecimalField("Price", validators=[DataRequired()])
    gltf = FileField("Upload an gltf")
    img = FileField("Upload an Image", validators=[DataRequired()])
    submit = SubmitField("Submit")


class RegisterForm(FlaskForm):
    name = StringField("Name", validators=[Length(min=5)])
    password = PasswordField("Short Description", validators=[
                             Length(min=8, max=128)])
    submit = SubmitField("Submit")


class RoomForm(FlaskForm):
    height = DecimalField("height", validators=[DataRequired(),NumberRange(min=2, max=10, message=None)])
    width = DecimalField("width", validators=[DataRequired(),NumberRange(min=3, max=10, message=None)])
    depth = DecimalField("depth", validators=[DataRequired(),NumberRange(min=3, max=10, message=None)])
    submit = SubmitField("Submit")


class OrderForm(FlaskForm):
    firstName = StringField("first name", validators=[DataRequired()])
    lastName = StringField("last name", validators=[DataRequired()])
    country = StringField("Country", validators=[DataRequired()])
    adress = StringField("Adress", validators=[DataRequired(),NumberRange(min=10000, max=99999, message=None)])
    postalCode = StringField("Postal Code", validators=[DataRequired()])
    keepInformations = BooleanField(false_values=(False, 'false', 0, '0'))
    submit = SubmitField("Place Order")
