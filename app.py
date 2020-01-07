from flask import (
    Flask,
    render_template,
    jsonify)
import pandas as pd

app = Flask(__name__)


@app.route("/")
def home_page():
    return render_template("index.html")


@app.route('/get-food')
def get_food():
   
    df = pd.read_csv('restaurants.csv')
    df.dropna(how='any', inplace=True)
    return jsonify(df.to_dict('records'))


if __name__ == "__main__":
    app.run(debug=True)
