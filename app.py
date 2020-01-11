from flask import (
    Flask,
    render_template,
    jsonify,
    request)
import pandas as pd
import pickle
import numpy as np
from sklearn.preprocessing import StandardScaler

app = Flask(__name__)

model = pickle.load(open('SVCmodel.pkl', 'rb'))

@app.route("/")
def home_page():
    return render_template("index.html")


@app.route('/get-food')
def get_food():
   
    df = pd.read_csv('restaurants.csv')
    df.dropna(how='any', inplace=True)
    return jsonify(df.to_dict('records'))

@app.route("/form", methods=["GET", "POST"])
def send():
    X1 = 0
    X2 = 0
    X3 = 0
    if request.method == "POST":
        X1 += int(request.form["Price"])
        X2 += int(request.form["Rating"])
        X3 += int(request.form["Popularity"])

    Xnew = np.asarray([X1,X2,X3])
    Xnew = Xnew.reshape(1,-1)
    # Xnew_scalled = X_scaler.transform(Xnew)
    ynew = model.predict(Xnew)
    ynew_str = str(ynew[0])

    return render_template('index.html', variable=ynew_str)

if __name__ == "__main__":
    app.run(debug=True)
