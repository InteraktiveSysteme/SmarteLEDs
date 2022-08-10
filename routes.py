from app import app
from routs_simuled import *

app.route("/", methods=['GET'])(index)
app.route("/index", methods=['GET'])(index)
app.route("/render", methods=['GET'])(render)
app.route("/test", methods=['GET'])(test)
app.route("/shop", methods=['GET'])(shop)
app.route("/shopping_cart", methods=['GET','POST'])(shoppingCart)
app.route("/lamp/<id>", methods=['GET'])(lamp)
app.route("/register", methods=['GET','POST'])(register)
app.route("/registerPage", methods=['GET','POST'])(registerPage)
app.route("/login", methods=['GET','POST'])(login)
app.route("/lamp/login", methods=['GET','POST'])(login)
app.route("/logout", methods=['GET','POST'])(logout)
app.route("/preSim", methods=['GET','POST'])(preSim)
app.route("/simuled", methods=['GET'])(simuled)
app.route("/testglb", methods=['GET'])(testglb)
app.route("/get/<file>", methods=['GET'])(expose_gltf)
app.route("/admin", methods=['GET'])(admin)
app.route("/addLamp", methods=['GET','POST'])(addLamp)
app.route("/lamp/<id>/delete", methods=['GET'])(loeschen)
app.route("/User/<id>/delete", methods=['GET'])(userLoeschen)
app.route("/shopLamp/<id>", methods=['GET','POST'])(shopLamp)
app.route("/shopLamp/login", methods=['GET','POST'])(login)
