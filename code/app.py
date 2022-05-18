from flask import Flask
from flask import render_template
import time
import os
import re
import markdown

app = Flask("SamuelsName")


@app.route('/')
def hello_world():  # put application's code here
    return 'Hello World! <a href="/render">render bootiful image</a>'

@app.route('/render')
def render():
	exec(open("Demo.py").read())
	return render_template('render.html')

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

	# funktion laedt lampenbeschreibung
	return render_template('lamp.html', description = "{a1}.md".format(a1 = lamplist[int(id)]), imglist= imglist)

if __name__ == '__main__':
    app.run()





