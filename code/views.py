from flask import Blueprint, request, url_for, redirect, render_template, flash

import time
import os
import re
import markdown

from flask import Blueprint, request, url_for, redirect, render_template, flash
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

    # funktion extrahiert lampe mit id {id} aus list
    print(lamplist[int(id)])
    # funktion erstellt liste mit bildern zugehoerig zu lampe {id}
    pat = "^{a1}.*\.jpg".format(a1 = lamplist[int(id)])
    imglist = []
    for e in entries:
        if re.match(pat, e):
            imglist.append(e)

    print(imglist)

    with open("a1.md".format(a1 = lamplist[int(id)]), 'r') as file:
        mdtext = file.read().split("\n")

    props = []
    vals = []
    mdtext, props, vals = process(mdtext)

    # funktion laedt lampenbeschreibung
    return render_template('lamp.html', description = mdtext, properties = props, values = vals, imglist= imglist)

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
    props = []
    vals = []
    for i in range(0, len(textarray)):
        #print("Durchlauf ", i)
        match = re.findall("^{.*}", textarray[i])
        match2 = re.split("^{.*}", textarray[i])

        if len(match) > 0:
            props.append(match[0])
            vals.append(match2[1].removeprefix(" "))
            textarray[i] = ""


    textarray = markdown.markdown("\n".join(str(x) for x in textarray))
    return textarray, props, vals
