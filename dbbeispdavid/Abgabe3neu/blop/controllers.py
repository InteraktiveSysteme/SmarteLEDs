from flask import render_template, redirect, flash, url_for, request
from flask_login import login_user, logout_user, current_user, login_required
from werkzeug.urls import url_parse
from blop import app, db
from blop.forms import LoginForm, RegisterForm, EditForm
from blop.models import User
from datetime import datetime


app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.sqlite3'

@app.before_request
def before_request():
    if current_user.is_authenticated:
        current_user.last_publish = datetime.utcnow()
        db.session.commit()


@app.route('/', methods=['GET'])
@app.route('/index', methods=['GET'])
@login_required
def index():
    posts = [
        {
            'author': {'username': 'Kris'},
            'body': 'Beautiful day in Germany!'
        },
        {
            'author': {'username': 'Kris'},
            'body': 'The movie was cool!'
        }
    ]
    return render_template('index.html', title='Home', posts=posts)


@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user is None or not user.check_password(form.password.data):
            flash('Invalid username or password')
            return redirect(url_for('login'))
        login_user(user, remember=form.remember_me.data)
        next_page = request.args.get('next')
        if not next_page or url_parse(next_page).netloc != '':
            next_page = url_for('index')
        return redirect(next_page)
    return render_template('login.html', title='Sign In', form=form)


@app.route('/logout', methods=['GET'])
def logout():
    logout_user()
    return redirect(url_for('index'))


@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    form = RegisterForm()
    if form.validate_on_submit():
        user = User(username=form.username.data, email=form.email.data)
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()
        flash('you are now registered user!')
        return redirect(url_for('login'))
    return render_template('register.html', title='register', form=form)


@app.route('/user/<username>')
@login_required
def user(username):
    user = User.query.filter_by(username=username).first_or_404()
    posts = [
        {'author': user, 'body': 'Test post 1'},
        {'author': user, 'body': 'Test post 2'}
    ]
    return render_template("user.html", user=user, posts=posts)

@app.route('/edit', methods=['GET', 'POST'])
def edit():
    if not current_user.is_authenticated:
        return redirect(url_for('index'))
    form = EditForm()
    if form.validate_on_submit():

        if  form.username.data == current_user.username:
            user = User(aboutme=form.aboutme.data)
            db.session.add(user)
            db.session.commit()
            flash('updated your personal Information!')

        else:
            raise ValueError('Super wichtiger Error der vermieden werden kann!')
            flash('First Log in please!')

        return redirect(url_for('login'))
    return render_template('edit.html', title='edit', form=form)


