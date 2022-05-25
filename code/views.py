from flask import Blueprint, request, url_for, redirect, render_template, flash
from flask import send_from_directory

import time
import os
import re

from flask import Blueprint, request, url_for, redirect, render_template, flash

import models

app = Blueprint('app', __name__, template_folder="templates/")

#@app.app_errorhandler(404)
#def page_not_found(e):
    #return render_template('404.html'), 404

@app.route('/')
def index():  # put application's code here
    return render_template('index.html')

@app.route('/lamplist')
def lampList():
    return render_template('lampList.html')

@app.route('/lamp/<id>')
# liste mit allen lamp und
# uri parameter /lamp/{id}
def lamp(id):

    # funktion erstellt dirliste mit allen lampennamen
    entries = os.listdir('static/lamps')
    lamplist = []
    for e in entries:
        if re.match(".*\.md", e):
            lamplist.append(re.sub("\..*", "", e))
    lamplist.sort()
    # funktion extrahiert lampe mit id {id} aus list
    print(lamplist[int(id)])
    # funktion erstellt liste mit bildern zugehoerig zu lampe {id}
    pat = "^{a1}.*\.jpg".format(a1 = lamplist[int(id)])
    imglist = []
    for e in entries:
        if re.match(pat, e):
            imglist.append(e)

    print(imglist)

    file = open("static/lamps/{a1}.md".format(a1 = lamplist[int(id)]))
    mdtext = file.read().split("\n")
    #print(mdtext)


    mdtext, entryList = process(mdtext)

    # funktion laedt lampenbeschreibung
    return render_template('lamp.html', description = mdtext, tableList = entryList, imglist= imglist)

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

def process(textarray):
    entryList = []
    for i in range(0, len(textarray)):
        #print("Durchlauf ", ihttps://www.codersdiaries.com/blog/flask-project-structure)
        property = re.findall("^{.*}", textarray[i])
        value = re.split("^{.*}", textarray[i])

        if len(property) > 0:
            entryList.append(models.TableEntry(property[0].replace("{", "").replace("}", ""), value[1].removeprefix(" ")))
            textarray[i] = ""

    textarray = "\n".join(str(x) for x in textarray)
    #print(textarray)
    #print(props)
    #print(vals)
    return textarray, entryList
