from blop import app
from blop import db


if __name__ == '__main__':
    db.create_all()
    app.run(debug=True)
