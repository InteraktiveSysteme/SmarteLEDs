from project.routes_simuled import *

# TODO: refactor url paths to:
#
#           /shopping_cart/del/<id>
#           /shopping_cart/add/<id>
# /shop  => /lamps/
#           /lamps/show/<id>
#           /lamps/del/<id>
#           /lamps/add/
#           /user/del/<id>

# main pages
app.route("/", methods=['GET'])(index)
app.route("/index", methods=['GET'])(index)
app.route("/simuled", methods=['GET','POST'])(simuled)
app.route("/admin", methods=['GET'])(admin)

# shopping cart
app.route("/shopping_cart", methods=['GET','POST'])(cart_show)
app.route("/delCart/<id>", methods=['GET'])(cart_delLamp)
app.route("/shopLamp/<id>", methods=['GET','POST'])(cart_addLamp)

# administer lamps
app.route("/shop", methods=['GET'])(lamp_showAll)
app.route("/lamp/<id>", methods=['GET'])(lamp_show)
app.route("/lamp/<id>/delete", methods=['GET'])(lamp_delete)
app.route("/addLamp", methods=['GET','POST'])(lamp_add)

# user accounts
app.route("/register", methods=['GET','POST'])(user_register)
app.route("/login", methods=['GET','POST'])(user_login)
app.route("/logout", methods=['GET','POST'])(user_logout)
app.route("/User/<id>/delete", methods=['GET'])(user_delete)

# blender renders
app.route("/renders", methods=['GET','POST'])(renders_showAll)
app.route("/renders/new", methods=['POST'])(renders_new)

# misc
app.route("/get/<file>", methods=['GET'])(expose_gltf)
#app.route("/shopLamp/login", methods=['GET','POST'])(login)
