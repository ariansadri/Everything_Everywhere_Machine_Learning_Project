from flask import (
    Flask,
    render_template,
    redirect,
    url_for,
    jsonify,
    request)
import pandas as pd
import pickle
import numpy as np
import datetime
from datetime import timedelta
from sklearn.preprocessing import StandardScaler
from sklearn.externals import joblib

app = Flask(__name__)

model = joblib.load("model_standarized")
earth_model = joblib.load("model_quakes")

y_new_str = ""
thing = ""


@app.route("/")
def home_page():
    return render_template("index.html")


@app.route("/earthquake_page",  methods=["GET", "POST"])
def earthquake2():
    global thing
    predict_date = ""

    if request.method == "POST":
        predict_date += str(request.form["Target_Date"])
        lastdate = "2020-01-07"
        lastdate_time = datetime.datetime.strptime(lastdate, '%Y-%m-%d')
        future_date = datetime.datetime.strptime(predict_date, '%Y-%m-%d')
        datediff = (future_date - lastdate_time).days
        forecast = earth_model.forecast(steps=datediff)[0]
        thing = "My forecast for {} is {}".format(future_date, forecast[-1])

    return render_template("Predict_Earth_Quake.html", prediction=thing)


@app.route('/get-food')
def get_food():

    df = pd.read_csv('restaurants.csv')
    df.dropna(how='any', inplace=True)
    return jsonify(df.to_dict('records'))


@app.route('/weather')
def weather():

    return render_template("index_weather.html")


@app.route("/form", methods=["GET", "POST"])
def send():
    global ynew_str
    ynew_str = ""
    X1 = 0
    X2 = 0
    X3 = 0
    if request.method == "POST":
        X1 += float(request.form["Price"])
        X2 += float(request.form["Rating"])
        X3 += float(request.form["Popularity"])

        X_new = np.asarray([X1, X2, X3])

        X_new = X_new.reshape(1, -1)

        y_new = model.predict(X_new)

        y_new_str = str(y_new[0])

    return render_template('index.html', RestaurantType=y_new_str)


if __name__ == "__main__":
    app.run(debug=True)


# gunicorn==19.9.0
# astroid==2.2.5
# certifi==2019.9.11
# Click==7.0
# colorama==0.4.1
# Flask==1.1.1
# Flask-SQLAlchemy==2.4.1
# gunicorn==19.9.0
# isort==4.3.21
# itsdangerous==1.1.0
# Jinja2==2.10.3
# lazy-object-proxy==1.4.1
# MarkupSafe==1.1.1
# mccabe==0.6.1
# numpy==1.17.3
# pandas==0.25.2
# psycopg2==2.8.4
# pylint==2.3.1
# python-dateutil==2.8.0
# pytz==2019.3
# six==1.12.0
# SQLAlchemy==1.3.10
# typed-ast==1.4.0
# Werkzeug==0.16.0
# wincertstore==0.2
# wrapt==1.11.2
