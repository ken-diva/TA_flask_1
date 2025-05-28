from flask import Flask, render_template

app = Flask(__name__)


@app.route("/")
def hello():
    return render_template("tes.html")
    return render_template("index.html")


@app.route("/map")
def map():
    return render_template("map.html")


@app.route("/room")
def room():
    return render_template("room.html")


if __name__ == "__main__":
    app.run(debug=True)
