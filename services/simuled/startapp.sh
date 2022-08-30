#!/bin/sh
export PYTHONDONTWRITEBYTECODE=1
export PYTHONUNBUFFERED=1
export FLASK_DEBUG=True
export FLASK_APP=project/__init__.py
pip install -r requirements.txt
flask run
