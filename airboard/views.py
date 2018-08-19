 
import os, inspect
from flask import (
    render_template,
    Response,
    request,
    jsonify)
from airboard import app
from airboard.data import read_csv
import pprint


# get project root dir
CURR_DIR = os.path.dirname(inspect.getabsfile(inspect.currentframe()))
ROOT_DIR = os.path.dirname(CURR_DIR)


# home route
@app.route('/home')
@app.route('/')
def home():
    return render_template('index.html')


@app.route("/data/market_domestic.json/<year>")
def get_by_year(year):

    # parse month
    month = [request.args.get("month", default=None, type=int)]

    # parse origin airport paramters
    origin = dict()
    origin.update({"country": [request.args.get('origin_country', default=None, type=str)]})
    origin.update({"state_code": [request.args.get('origin_state', default=None, type=str)]})
    origin.update({"city": [request.args.get('origin_city', default=None, type=str)]})

    # parse destination airport parameter
    dest = dict()
    dest.update({"country": [request.args.get('dest_country', default=None, type=str)]})
    dest.update({"state_code": [request.args.get('dest_state', default=None, type=str)]})
    dest.update({"city": [request.args.get('dest_city', default=None, type=str)]})

    # parse career
    carrier = dict()
    carrier.update({"name": [request.args.get("carrier_name", default=None, type=str)]})


    print("month = ", month)
    print("origin:")
    pprint.pprint(origin)
    print("dest:")
    pprint.pprint(dest)
    print("carrier:")
    pprint.pprint(carrier)


    json = read_csv(year=year,
                    month=month,
                    origin=origin,
                    dest=dest,
                    carrier=carrier)

    return Response(json,
                    status=200,
                    mimetype="application/json")


