@echo off
set PYTHONDONTWRITEBYTECODE=1
$env:PYTHONDONTWRITEBYTECODE = "1"
set FLASK_APP=project\__init__.py
$env:FLASK_APP = "project\__init__.py"
flask db migrate -m "Migrate "
flask db upgrade

PAUSE