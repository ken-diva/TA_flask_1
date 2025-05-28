from flask import Flask, render_template, jsonify

app = Flask(__name__)


@app.route("/")
def tes():
    return render_template("tes2.html")


if __name__ == "__main__":
    app.run(debug=True)
