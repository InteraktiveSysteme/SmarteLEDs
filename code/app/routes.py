from flask import render_template, request, url_for
import os
import re
import markdown
from app import app, db, User


@app.route('/child')
def child():  # put application's code here
    return render_template('child.html')


@app.route('/test')
def test():  # put application's code here
    return render_template('test.html')


@app.route('/')
def index():  # put application's code here
    return render_template('index.html')


@app.route('/render')
def render():
    exec(open("Demo.py").read())
    return render_template('render.html')


@app.route('/lampList')
def lampList():
    return render_template('lampList.html')


@app.route('/lamp/<id>')
# liste mit allen lamp und
# uri parameter /lamp/{id}
def lamp(id):
    # funktion erstellt dirliste mit allen lampennamen
    entries = os.listdir('app/static/lamps')
    lamplist = []
    for e in entries:
        if re.match(".*\.md", e):
            lamplist.append(re.sub("\..*", "", e))

    # funktion extrahiert lampe mit id {id} aus list
    print(lamplist[int(id)])
    # funktion erstellt liste mit bildern zugehoerig zu lampe {id}
    pat = "^{a1}.*\.jpg".format(a1=lamplist[int(id)])
    imglist = []
    for e in entries:
        if re.match(pat, e):
            imglist.append(e)

    print(imglist)

    # funktion laedt lampenbeschreibung
    return render_template('lamp.html', description="{a1}.md".format(a1=lamplist[int(id)]), imglist=imglist)




@app.route('/login', methods=["POST"])
def login():
    username = request.form.get("username")
    password = request.form.get("password")
    login = request.form.get("loginbutton")
    register = request.form.get("registerbutton")

    print("username: ", username, "  password: ", password, "login: ", login, "  register: ", register)
    user = User(username=username, password=password)
    # register
    if login == None:
        try:
            db.session.add(user)
            db.session.commit()
            print("registered!")
        except:
            return "Error while adding user to Database"

    #if register == None:
        #missing (login)
    return render_template('index.html')
