from flask import Flask
from flask import render_template
import time
import os
import re
#import markdown

app = Flask("LedsSim")

@app.route('/static/Gltf/<filename>',methods = ['GET','POST'])
def get_files(filename):
    """Download a file."""
    try:
		path = "static/Gltf/" + filename
		return send_from_directory(DOWNLOAD_DIRECTORY, path, as_attachment=True)
    except FileNotFoundError:
        abort(404)

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





