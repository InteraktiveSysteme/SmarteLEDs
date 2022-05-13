from flask import Flask
from flask import render_template
import time
import os
import re

app = Flask("SamuelsName")


@app.route('/')
def hello_world():  # put application's code here
    return 'Hello World! <a href="/render">render bootiful image</a>'

@app.route('/render')
def render():
	exec(open("Demo.py").read())
	return render_template('render.html')

@app.route('/lamp')
def lamp():
	entries = os.listdir('static/lamps')
	pattern = ".*\.md"
	list = []
	for e in entries:
    		if re.match(".*\.md", e):
        		list.append(re.sub("\..*", "", e))
	del entries
	return render_template('lamp.html', list = list)



print("")
print("")
print("")

print("")
print("")
print("")
print("")
print("")





#print(re.sub("lamp01.md", lambda entry: entry, entries))

#a = 'the quick brown fox jumped over the green lazy python'
#print(re.sub("(\w+)",
#             lambda x: x.group(1).capitalize(),
#             a))
#print(list(filteredlist))

if __name__ == '__main__':
    app.run()





