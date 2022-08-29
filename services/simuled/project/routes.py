from project.routes_simuled import *

# main path
app.route("/", methods=['GET'])(index)
app.route("/index", methods=['GET'])(index)

# simuled simulation
app.route("/simuled", methods=['GET','POST'])(simuled)

# shopping page
app.route("/shop", methods=['GET'])(shop)

# shopping cart
app.route("/shopping_cart", methods=['GET','POST'])(shoppingCart)
app.route("/delCart/<id>", methods=['GET'])(deleteCart)

# administer lamps
app.route("/lamp/<id>", methods=['GET'])(lamp)
app.route("/lamp/<id>/delete", methods=['GET'])(loeschen)
app.route("/shopLamp/<id>", methods=['GET','POST'])(shopLamp)
app.route("/addLamp", methods=['GET','POST'])(addLamp)

# user accounts
app.route("/register", methods=['GET','POST'])(register)
app.route("/registerPage", methods=['GET','POST'])(registerPage)
app.route("/login", methods=['GET','POST'])(login)
app.route("/logout", methods=['GET','POST'])(logout)
app.route("/admin", methods=['GET'])(admin)
app.route("/User/<id>/delete", methods=['GET'])(userLoeschen)

# blender renders
app.route("/render", methods=['GET'])(render)
app.route("/renders/rooms", methods=['GET','POST'])(renders)
app.route("/renders/add/<id>", methods=['POST'])(saveRender)

# misc
app.route("/get/<file>", methods=['GET'])(expose_gltf)
#app.route("/shopLamp/login", methods=['GET','POST'])(login)
