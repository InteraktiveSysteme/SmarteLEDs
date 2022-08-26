import re
from project import *
from flask import Flask, render_template, request, flash, url_for, redirect, make_response, send_from_directory
from flask import render_template
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import uuid as uuid
import os
import json
from flask_login import *
from project import forms
##
# @brief This function creates an Cart element for a specific lamp you want to shop
# @param id is the lampID
# ...
# @return the HTML template
@login_required
def renders():
    renders = Render.query.filter_by(userID=current_user.userID)
    return render_template('renders.html', renders = renders)

def safeRender(path):
        secureName = secure_filename(current_user.userName)
        saveName = str(uuid.uuid1()) + "_" + imgName
        imgName = saveName
        img.save(os.path.join(app.config['UPLOAD_FOLDER'], saveName))    
        img = app.config['UPLOAD_FOLDER'], saveName
        render = Render(userID=current_user.userID, imgName=img)

        db.session.add(render)
        db.session.commit()
        return app.config['UPLOAD_FOLDER'], saveName

def shopLamp(id):  # put application's code here
    if current_user.is_authenticated:
        # create a cart obj in the Database
        cart = Cart(userID=current_user.userID, lampID=id, amount=1)
        db.session.add(cart)
        db.session.commit()
        lamps = Lamp.query.order_by(Lamp.timeStamp)
        resp = render_template("shop.html", lamps=lamps), 200
    else:
        lamps = Lamp.query.order_by(Lamp.timeStamp)
        if request.cookies.get('cart') is None:
            cartTEMP = []
            cartTEMP.append(int(id))
            resp = make_response(render_template(
                "shop.html", lamps=lamps), 200)
        else:
            cartTEMP = json.loads(request.cookies.get('cart'))
            cartTEMP.append(int(id))
            resp = make_response(render_template(
                "shop.html", lamps=lamps), 200)
        cartJSON = json.dumps(cartTEMP)
        resp.set_cookie('cart', cartJSON)

    return resp

##
# @brief This function gives the form information to the preSim template
# @return the HTML template
def preSim():
    if request.method == "GET":
        # GET branch to return the Template and Form
        form = forms.RoomForm()
        return render_template('preSim.html', form=form)

    if request.method == "POST":
        # POST branch to get the Room Informations
        width = request.form["width"]
        height = request.form["height"]
        depth = request.form["depth"]
        lamps = Lamp.query.order_by(Lamp.timeStamp)
        gltf =[]
        try:
            for lamp in lamps:
                gltf.append(lamp.gltfName)
        except:
            print("nicht alle GLTFs konnten geladen werden. Dies liegt moeglicherweise daran, dass eione Lampe kein GLTF hat... [ERROR]")
        lamps = json.dumps(gltf)
        return render_template('simuled.html', width=width, height=height, depth=depth, gltf = gltf)

##
# @brief This function handles the Shopping Cart logic
# @return the HTML template
def shoppingCart():
    form = forms.OrderForm()
    lamps = []
    if current_user.is_authenticated:
        if request.method == "POST":
            #The following Shipping Informations are useful if you want to deploy this Software
            firstName = request.form["firstName"]
            lastName = request.form["lastName"]
            country = request.form["country"]
            adress = request.form["adress"]
            postalCode = request.form["postalCode"]
            carts = Cart.query.filter_by(userID=current_user.userID)
            #deleting all objects from the cart
            for cart in carts:
                db.session.delete(cart)
            db.session.commit()
            flash(message="Thanks for ordering!")
            return render_template('index.html')

        if request.method == "GET":
            carts = Cart.query.filter_by(userID=current_user.userID)
            lamps = []
            for cart in carts:
                lamps.append(Lamp.query.get_or_404(cart.lampID))
            summe = 0
            for lamp in lamps: #calculation of the final sum
                if type(lamp.lampPrice) == float or type(lamp.lampPrice) == int:
                    summe += lamp.lampPrice
                else:
                    summe += float(lamp.lampPrice.replace(",", "."))
            return render_template('shoppingCartV3.html', lamps=lamps, summe=round(summe, 2), form=form)

    else:
        if (request.cookies.get('cart') is None):
            return render_template('shoppingCart.html')
        else:
            cartTEMP = json.loads(request.cookies.get('cart'))
            for i in cartTEMP:
                lamps.append(Lamp.query.get(i))

    summe = 0
    for lamp in lamps:
        print(type(lamp.lampPrice))
        if type(lamp.lampPrice) == float or type(lamp.lampPrice) == int:
            summe += lamp.lampPrice
        else:
            summe += float(lamp.lampPrice.replace(",", "."))
    return render_template('shoppingCartV3.html', lamps=lamps, summe=round(summe, 2), form=form)


def test():  # put application's code here
    return render_template('test.html')


def expose_gltf(file):
    return send_from_directory(os.path.join(app.root_path, 'static/Gltf'), file)


def testglb():
    return render_template('testglb.html')


def index():  # put application's code here
    print("index")
    return render_template('index.html')


def render():
    exec(open("Demo.py").read())
    return render_template('render.html')


def simuled():
    lamps = Lamp.query.order_by(Lamp.timeStamp)
    return render_template('simuled.html', lamps=lamps)


##
# @brief This function handles the addLamp logic. It provides the feature of adding a new Lamp
# @return the HTML template
@login_required
def addLamp():
    if request.method == "GET":
        form = forms.AddLampForm()
        return render_template('addLamp.html', form=form)
    if request.method == "POST":
        #we first get the information about the Lamp we are about to safe through the form
        name = request.form["name"]
        img = request.files["img"]
        gltf = request.files["gltf"]
        text = request.form["shortText"]
        longtext = request.form["longText"]
        price = request.form["price"]

        

        imgName = secure_filename(img.filename)
        saveName = str(uuid.uuid1()) + "_" + imgName
        imgName = saveName
        img.save(os.path.join(app.config['UPLOAD_FOLDER'], saveName))

        gltfName = secure_filename(gltf.filename)
        savegltfName = str(uuid.uuid1()) + "_" + gltfName
        gltfName = savegltfName
        gltf.save(os.path.join(app.root_path +"/static/Gltf/Lampen/", savegltfName))

        #now we add the lamp to the database
        lamp = Lamp(lampName=name, imgName=imgName, gltfName=gltfName, lampPrice=price, lampText=text,
                    lampLongText=longtext)
        db.session.add(lamp)
        db.session.commit()
        print(name)
        lamp = Lamp.query.order_by(Lamp.timeStamp)
        lamps = Lamp.query.order_by(Lamp.timeStamp)
        flash(message="Lamp added!")
        form = forms.AddLampForm()
        return render_template("addLamp.html", form=form), 200


def shop():
    lamps = Lamp.query.order_by(Lamp.timeStamp)
    return render_template("shop.html", lamps=lamps), 200

##
# @brief This function handles the adminLogic
# @return the HTML template
@login_required
def admin():
    if current_user and current_user.admin:
        lamps = Lamp.query.order_by(Lamp.timeStamp)
        users = User.query.order_by(User.timeStamp)
        return render_template("admin.html", users=users, lamps=lamps), 200
    flash("Admin Page is for Admins only")
    return render_template("index"), 200


def registerPage():
    form = forms.RegisterForm()
    return render_template('registerPage.html', form=form)


##
# @brief This function handles the adminLogic
# @param id is the LampID that you want to show in detail
# @return the HTML template
def lamp(id):
    # funktion erstellt dirliste mit allen lampennamen
    lamp = Lamp.query.get_or_404(id)

    #entries = os.listdir(app.config['UPLOAD_FOLDER'])
    lamplist = []
    #for e in entries:
        #if re.match(".*\.md", e):
            #lamplist.append(re.sub("\..*", "", e))

    # funktion extrahiert lampe mit id {id} aus list
    #print(lamplist[int(id)])
    # funktion erstellt liste mit bildern zugehoerig zu lampe {id}
    #pat = "^{a1}.*\.jpg".format(a1=lamplist[int(id)])
    #imglist = []
    #for e in entries:
        #if re.match(pat, e):
            #imglist.append(e)

    #print(imglist)

    # funktion laedt lampenbeschreibung
    #return render_template('lamp.html', description="{a1}.md".format(a1=lamplist[int(id)]), imglist=imglist, lamp=lamp,
    return render_template('lamp.html', description="", imglist="", lamp=lamp,
                           name=lamp.lampName, text=lamp.lampText, price=lamp.lampPrice, img=lamp.imgName,
                           longText=lamp.lampLongText)

##
# @brief This function handles the register Logic
# @return the HTML template
def register():
    username = request.form['name']
    password = request.form["password"]
    try:
        user = User.query.filter_by(userName=username).first()
        if user:
            flash("Username already in Usage")
            return render_template("registerPage.html")
    except:
        print("Username not found")
    admin = False
    if username[0:5] == "admin":
        admin = True
    login = request.form.get("loginbutton")
    register = request.form.get("registerbutton")
    print("username: ", username, "  password: ", password,
          "login: ", login, "  register: ", register)
    user = User(userName=username, password=password, admin=admin)
    print(login)

    db.session.add(user)
    db.session.commit()
    print("registered!")
    flash(message="Registered!")

    return render_template('index.html')

##
# @brief This function gets the information from a form and uses the login_user function to sign in the user
# @param 
# ...
# @return the HTML template of the landing page
def login():
    username = request.form['username']
    password = request.form["password"]
    user = User.query.filter_by(userName=username).first()
    if user:
        if user.verifyPassword(password):
            login_user(user)
            flash("Logged in!")

        else:
            flash("Wrong Password")
    else:
        flash("User does not Exist")
    return render_template('index.html')

##
# @brief This function logs out the current user
# @param 
# ...
# @return the HTML template of the landing page
@login_required
def logout():
    logout_user()
    flash("You are not logged in anymore!")
    return render_template('index.html')

##
# @brief This function deletes the Lamp  in the Database with the given ID
# @param id of the lamp to delete
# ...
# @return the HTML template of the Shop page
def loeschen(id):
    deletable = Lamp.query.get_or_404(id)
    users = User.query.order_by(User.timeStamp)

    try:
        imgName = deletable.imgName
        db.session.delete(deletable)
        db.session.commit()
        os.remove("/static/Imgages/", imgName)
        lamps = Lamp.query.order_by(Lamp.timeStamp)
        return render_template("shop.html", lamps=lamps, users=users)

    except:
        print("error")
        lamps = Lamp.query.order_by(Lamp.timeStamp)
        return render_template("shop.html", lamps=lamps, users=users)

    lamps = Lamp.query.order_by(Lamp.timeStamp)
    return render_template("shop.html", lamps=lampsv)

##
# @brief This function deletes the User  in the Database with the given ID
# @param id of the user to delete
# ...
# @return the HTML template of the admin page
@login_required
def userLoeschen(id):
    deletable = User.query.get_or_404(id)
    lamps = Lamp.query.order_by(Lamp.timeStamp)

    try:
        db.session.delete(deletable)
        db.session.commit()
        users = User.query.order_by(User.timeStamp)
        return render_template("admin.html", users=users, lamps=lamps)

    except:
        print("error")
        users = User.query.order_by(User.timeStamp)
        return render_template("admin.html", users=users, lamps=lamps)

    users = User.query.order_by(User.timeStamp)
    return render_template("admin.html", users=users, lamps=lamps)

##
# @brief This function serves an Error Page
# @param 
# ...
# @return the error Page
@app.errorhandler(404)
def page_not_found(e):
    # note that we set the 404 status explicitly
    return render_template("404.html"), 404
