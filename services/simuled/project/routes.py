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
app.route("/shopping_cart/del/<id>", methods=['GET'])(cart_delLamp)
app.route("/shopping_cart/add/<id>", methods=['GET','POST'])(cart_addLamp)

# administer lamps
app.route("/lamps", methods=['GET'])(lamp_showAll)
app.route("/lamps/show/<id>", methods=['GET'])(lamp_show)
app.route("/lamps/add", methods=['GET','POST'])(lamp_add)
app.route("/lamps/del/<id>", methods=['GET'])(lamp_delete)

# user accounts
app.route("/user/add", methods=['GET','POST'])(user_add)
app.route("/user/del/<id>", methods=['GET'])(user_delete)
app.route("/user/login", methods=['GET'])(user_login)
app.route("/user/logout", methods=['GET','POST'])(user_logout)

# blender renders
app.route("/renders", methods=['GET','POST'])(renders_showAll)
app.route("/renders/new", methods=['POST'])(renders_new)
app.route("/renders/del/<id>", methods=['GET'])(renders_delete)

# misc
app.route("/gltf/<file>", methods=['GET'])(expose_gltf)
#app.route("/shopLamp/login", methods=['GET','POST'])(login)
