import itertools

from flask import Blueprint, request, url_for, redirect, render_template, flash, make_response
from flask import send_from_directory

import time
import os
import re
import json

gString = ""

from flask import Blueprint, request, url_for, redirect, render_template, flash

app = Blueprint('Simuled Website', __name__, template_folder="templates/")


imglist = []

#@app.app_errorhandler(404)
#def page_not_found(e):
    #return render_template('404.html'), 404

@app.route('/')
def index():  # put application's code here
    return render_template('index.html')

@app.route('/put/<string>')
def put(string):
    gString = string
    gString = "lololoLOL"
    return string

@app.route('/pull')
def pull():
    print("gString", gString)
    return "gstring: " + gString

@app.route('/lamplist')
def lampList():
    return render_template('lampList.html')

@app.route('/addtocart/<id>', methods = ['POST', 'GET'])
def addtocart(id):
    #if request.method == 'POST':

        lamplist = createList()
        #cart = []
        if(request.cookies.get('cart') is None):
            cartTEMP = []
        else:
            cartTEMP = json.loads(request.cookies.get('cart'))
        print(request.cookies.get('cart'))
        print(type(request.cookies.get('cart')))
        cartTEMP.append(id)
        #cartTEMP.append(lamplist[int(id)])


        file = open("static/lamps/{a1}.md".format(a1=lamplist[int(1)]))
        mdtext = file.read().split("\n")
        # print(mdtext)


        mdtext, data = extractTableData(mdtext)
        resp = make_response(render_template('shopping_cart.html', shoppingCart = cartTEMP, description = mdtext, imgList = getLampImages(1) ))
        #resp = make_response(render_template('index.html'))

        #return render_template('shopping_cart.html', shoppingCart=cartTEMP,  imgList=getLampImages(1))

        cartJSON = json.dumps(cartTEMP)
        resp.set_cookie('cart', cartJSON)
        print(cartJSON)


        return resp

@app.route('/deletefromcart/<cartID>')
def deletefromcart(cartID):
    file = open("static/lamps/{a1}.md".format(a1=createList()[int(1)]))
    mdtext = file.read().split("\n")
    mdtext, data = extractTableData(mdtext)
    cartTEMP = json.loads(request.cookies.get('cart'))
    if(request.cookies.get('cart') is not None and len(cartTEMP)>int(cartID)):

        cartTEMP.pop(int(cartID))
        cartJSON = json.dumps(cartTEMP)

        resp = make_response(render_template('shopping_cart.html', shoppingCart=cartTEMP,
                                             description=mdtext, imgList=getLampImages(1)))
        resp.set_cookie('cart', cartJSON)
        return resp
    return render_template('shopping_cart.html', shoppingCart=cartTEMP,
                                             description=mdtext, imgList=getLampImages(1))

@app.route('/shopping_cart')
def shopping_cart():
    lamplist = createList()
    if (request.cookies.get('cart') is None):
        cartTEMP = []
        return render_template('shopping_cart.html')
    else:

        cartTEMP = json.loads(request.cookies.get('cart'))
        print(len(cartTEMP))

        file = open("static/lamps/{a1}.md".format(a1=lamplist[int(1)]))
        mdtext = file.read().split("\n")
        # print(mdtext)

        mdtext, data = extractTableData(mdtext)
        return render_template('shopping_cart.html', shoppingCart = cartTEMP, description = mdtext, imgList = getLampImages(1) )


@app.route('/lamp/<id>')
# liste mit allen lamp und
# uri parameter /lamp/{id}
def lamp(id):


    lamplist = createList()
    print(len(lamplist))

    # funktion extrahiert lampe mit id {id} aus list
    #print(lamplist[int(id)])



    file = open("static/lamps/{a1}.md".format(a1 = lamplist[int(id)]))
    mdtext = file.read().split("\n")
    #print(mdtext)

    mdtext, data = extractTableData(mdtext)

    return render_template('lamp.html', description = mdtext, tableContent = data, imglist= imglist, zip=zip, indices=itertools.count)

def extractTableData(textarray):
    vals = []
    props = []
    for i in range(0, len(textarray)):
        property = re.findall("^{.*}", textarray[i])
        value = re.split("^{.*}", textarray[i])

        if len(property) > 0:
            props.append(property[0].replace("{", "").replace("}", ""))
            vals.append(value[1].removeprefix(" "))
            textarray[i] = ""

    textarray = "\n".join(str(x) for x in textarray)
    #print(textarray)
    #print(props)
    #print(vals)
    data = zip(props, vals)
    return textarray, data

def createList():
    # funktion erstellt dirliste mit allen lampennamen
    entries = os.listdir('static/lamps')
    lamplistTEMP = []
    for e in entries:
        if re.match(".*\.md", e):
            lamplistTEMP.append(re.sub("\..*", "", e))
    lamplistTEMP.sort()

    #lamplist = lamplistTEMP

    return lamplistTEMP
    #print(lamplistTEMP)
    #imglist = imglistTEMP

def getLampImages(id):
    # funktion erstellt liste mit bildern zugehoerig zu lampe {id}
    imglistTEMP = []
    entries = os.listdir('static/lamps')
    lamplist = createList()
    pat = "^{a1}.*\.jpg".format(a1=lamplist[int(id)])
    for e in entries:
        if re.match(pat, e):
            imglistTEMP.append(e)
    return imglistTEMP

def calcCartPrice():
    if (request.cookies.get('cart') is not None):
        cartTEMP = json.loads(request.cookies.get('cart'))


@app.route('/test')
def test():  # put application's code here
    return render_template('test.html')

@app.route('/child')
def child():  # put application's code here
    return render_template('child.html')

@app.route('/render')
def render():
    exec(open("Demo.py").read())
    return render_template('render.html')

