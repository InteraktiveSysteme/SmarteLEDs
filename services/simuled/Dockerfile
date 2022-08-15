# building dockercontainer
FROM python:slim-buster as builder

WORKDIR /usr/src/app

# environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# dependencies
RUN apt update && apt install -y --no-install-recommends gcc
RUN pip install --upgrade pip

# copying project files
COPY . /usr/src/app
COPY ./requirements.txt .

RUN pip wheel --no-cache-dir --no-deps --wheel-dir /usr/src/app/wheels -r requirements.txt

# pull official base image
FROM python:slim-buster

# set work directory
RUN mkdir -p /home/app

# create system user app
RUN addgroup --system app && adduser --system --group app 

# create directories
ENV HOME=/home/app
ENV APP_HOME=/home/app/simuled
RUN mkdir $APP_HOME
WORKDIR $APP_HOME

# install dependencies
RUN apt-get update && apt-get install -y --no-install-recommends netcat
COPY --from=builder /usr/src/app/wheels /wheels
COPY --from=builder /usr/src/app/requirements.txt .
RUN pip install --upgrade pip
RUN pip install --no-cache /wheels/*

# copy entrypoint to app home
COPY ./entrypoint.sh $APP_HOME

# copy project files to app home
COPY . $APP_HOME

# ownership of all files to app user
RUN chown -R app:app $APP_HOME

# run as user app
USER app

ENTRYPOINT ["/home/app/simuled/entrypoint.sh"]
