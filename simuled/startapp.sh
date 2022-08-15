#!/bin/sh

export PYTHONDONTWRITEBYTECODE=1
export PYTHONUNBUFFERED=1
export FLASK_APP=project/__init__.py

flask run
