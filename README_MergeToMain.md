# Migration from branch dockerless into main
In order to make merge easier, branch the current dockerless branch onto a temporary local
branch called "dockerPreMain" or similar 
```
git branch dockerPreMain
```
and change the structure on the branch in a way that makes merge easier. Do the following...

Don't push the temporary merge branch upstream and delete on your local machine after the merge.

## Has to be deleted before merge
services/simuled/manage.py: keep version of main (Delete on temporary merge branch)
services/simuled/project/migrations

## Easy merge (independent from docker container / db configuration)
services/simuled/requirements.txt: Don't delete psycopg and gunicorn (needed in docker)
services/simuled/project/config.py
services/simuled/project/routes.py
services/simuled/project/routes\_simuled.py: be careful with filepaths, make sure they are relative
services/simuled/project/forms.py
services/simuled/project/static
services/simuled/project/templates

## Advanced merge (merge with care to not destroy container integrity)
services/simuled/\_\_init\_\_.py:
	- remove line: ``from flask_migrate import Migrate``
	- remove line: ``migrate = Migrate(app, db)``
	- add line: ``app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_host=1)`` after app = Flask(\_\_name\_\_)
	- remove line: ``db.create_all()``
