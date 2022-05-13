from flask import Flask
from flask import render_template
import time

app = Flask(__name__)


@app.route('/')
def hello_world():  # put application's code here
    return 'Hello World! <a href="/render">render bootiful image</a>'

@app.route('/render')
def render():
	exec(open("Demo.py").read())
	return render_template('render.html')


if __name__ == '__main__':
    app.run()
