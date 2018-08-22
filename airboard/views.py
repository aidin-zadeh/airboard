 
import os, inspect
from flask import (
    render_template,
    Response,
    request,
    jsonify)

from airboard import app
from airboard.data import (
    session,
    read_csv,
    query_stats_by_state,
    query_stats_by_city,
    query_stats_by_airport,
    query_topn_outgoing_by_state,
    query_topn_outgoing_by_city,
    query_topn_outgoing_by_airport,
    query_topn_outgoing_by_carrier,
    )
import pprint
from time import time

# get project root dir
CURR_DIR = os.path.dirname(inspect.getabsfile(inspect.currentframe()))
ROOT_DIR = os.path.dirname(CURR_DIR)


TOPN = 5

@app.teardown_request
def remove_session(ex=None):
    session.remove()


# home route
@app.route('/home')
@app.route('/')
def home():
    return render_template('index.html')


@app.route("/data/market_domestic.json/<year>")
def read_csc(year):

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


@app.route("/data/state/market_domestic_stats.json/<year>")
def get_state_stats(year):

    # parse month
    month = [request.args.get("month", default=None, type=int)]

    # parse origin airport paramters
    origin = dict()
    origin.update({"country": [request.args.get('origin_country', default=None, type=str)]})
    origin.update({"state_code": [request.args.get('origin_state', default=None, type=str)]})
    origin.update({"city": [request.args.get('origin_city', default=None, type=str)]})
    origin.update({"airport_code": [request.args.get('origin_airport_code', default=None, type=str)]})

    # parse destination airport parameter
    dest = dict()
    dest.update({"country": [request.args.get('dest_country', default=None, type=str)]})
    dest.update({"state_code": [request.args.get('dest_state', default=None, type=str)]})
    dest.update({"city": [request.args.get('dest_city', default=None, type=str)]})
    dest.update({"airport_code": [request.args.get('dest_airport_code', default=None, type=str)]})

    # parse career
    carrier = dict()
    carrier.update({"code": [request.args.get("carrier_code", default=None, type=str)]})
    carrier.update({"name": [request.args.get("carrier_name", default=None, type=str)]})

    d = query_stats_by_state(year=year,
                             month=month,
                             origin=origin,
                             dest=dest,
                             carrier=carrier,
                             sort_by=None)

    return jsonify(d)


@app.route("/data/city/market_domestic_stats.json/<year>")
def get_city_stats(year):

    # parse month
    month = [request.args.get("month", default=None, type=int)]

    # parse origin airport paramters
    origin = dict()
    origin.update({"country": [request.args.get('origin_country', default=None, type=str)]})
    origin.update({"state_code": [request.args.get('origin_state', default=None, type=str)]})
    origin.update({"city": [request.args.get('origin_city', default=None, type=str)]})
    origin.update({"airport_code": [request.args.get('origin_airport_code', default=None, type=str)]})

    # parse destination airport parameter
    dest = dict()
    dest.update({"country": [request.args.get('dest_country', default=None, type=str)]})
    dest.update({"state_code": [request.args.get('dest_state', default=None, type=str)]})
    dest.update({"city": [request.args.get('dest_city', default=None, type=str)]})
    dest.update({"airport_code": [request.args.get('dest_airport_code', default=None, type=str)]})

    # parse career
    carrier = dict()
    carrier.update({"code": [request.args.get("carrier_code", default=None, type=str)]})
    carrier.update({"name": [request.args.get("carrier_name", default=None, type=str)]})

    d = query_stats_by_city(year=year,
                            month=month,
                            origin=origin,
                            dest=dest,
                            carrier=carrier,
                            sort_by=None)

    return jsonify(d)


@app.route("/data/airport/market_domestic_stats.json/<year>")
def get_airport_stats(year):

    # parse month
    month = [request.args.get("month", default=None, type=int)]

    # parse origin airport paramters
    origin = dict()
    origin.update({"country": [request.args.get('origin_country', default=None, type=str)]})
    origin.update({"state_code": [request.args.get('origin_state', default=None, type=str)]})
    origin.update({"city": [request.args.get('origin_city', default=None, type=str)]})
    origin.update({"airport_code": [request.args.get('origin_airport_code', default=None, type=str)]})

    # parse destination airport parameter
    dest = dict()
    dest.update({"country": [request.args.get('dest_country', default=None, type=str)]})
    dest.update({"state_code": [request.args.get('dest_state', default=None, type=str)]})
    dest.update({"city": [request.args.get('dest_city', default=None, type=str)]})
    dest.update({"airport_code": [request.args.get('dest_airport_code', default=None, type=str)]})

    # parse career
    carrier = dict()
    carrier.update({"code": [request.args.get("carrier_code", default=None, type=str)]})
    carrier.update({"name": [request.args.get("carrier_name", default=None, type=str)]})

    d = query_stats_by_airport(year=year,
                               month=month,
                               origin=origin,
                               dest=dest,
                               carrier=carrier,
                               sort_by=None)

    return jsonify(d)


@app.route("/data/state/out/topn_stats.json/<year>/<state_code>/<sort_by>")
def get_state_topn_outgoing_stats(year, state_code, sort_by):

    # parse month
    month = [request.args.get("month", default=None, type=int)]

    # parse origin airport parameters
    origin = dict()
    origin.update({"country": [request.args.get('origin_country', default=None, type=str)]})
    origin.update({"state_code": [request.args.get('origin_state', default=None, type=str)]})
    origin.update({"city": [request.args.get('origin_city', default=None, type=str)]})
    origin.update({"airport_code": [request.args.get('origin_airport_code', default=None, type=str)]})

    # parse destination airport parameter
    dest = dict()
    dest.update({"country": [request.args.get('dest_country', default=None, type=str)]})
    dest.update({"state_code": [request.args.get('dest_state', default=None, type=str)]})
    dest.update({"city": [request.args.get('dest_city', default=None, type=str)]})
    dest.update({"airport_code": [request.args.get('dest_airport_code', default=None, type=str)]})

    # parse career
    carrier = dict()
    carrier.update({"code": [request.args.get("carrier_code", default=None, type=str)]})
    carrier.update({"name": [request.args.get("carrier_name", default=None, type=str)]})

    d = query_topn_outgoing_by_state(year=year,
                                     state_code=state_code,
                                     sort_by=sort_by,
                                     month=month,
                                     origin=origin,
                                     dest=dest,
                                     carrier=carrier,
                                     topn=TOPN)

    return jsonify(d)


@app.route("/data/city/out/topn_stats.json/<year>/<city>/<sort_by>")
def get_city_topn_outgoing_stats(year, city, sort_by):

    # parse month
    month = [request.args.get("month", default=None, type=int)]

    # parse origin airport parameters
    origin = dict()
    origin.update({"country": [request.args.get('origin_country', default=None, type=str)]})
    origin.update({"state_code": [request.args.get('origin_state', default=None, type=str)]})
    origin.update({"city": [request.args.get('origin_city', default=None, type=str)]})
    origin.update({"airport_code": [request.args.get('origin_airport_code', default=None, type=str)]})

    # parse destination airport parameter
    dest = dict()
    dest.update({"country": [request.args.get('dest_country', default=None, type=str)]})
    dest.update({"state_code": [request.args.get('dest_state', default=None, type=str)]})
    dest.update({"city": [request.args.get('dest_city', default=None, type=str)]})
    dest.update({"airport_code": [request.args.get('dest_airport_code', default=None, type=str)]})

    # parse career
    carrier = dict()
    carrier.update({"code": [request.args.get("carrier_code", default=None, type=str)]})
    carrier.update({"name": [request.args.get("carrier_name", default=None, type=str)]})

    d = query_topn_outgoing_by_city(year=year,
                                    city=city,
                                    sort_by=sort_by,
                                    month=month,
                                    origin=origin,
                                    dest=dest,
                                    carrier=carrier,
                                    topn=TOPN)

    return jsonify(d)



@app.route("/data/airport/out/topn_stats.json/<year>/<airport_code>/<sort_by>")
def get_airport_topn_outgoing_stats(year, airport_code, sort_by):

    # parse month
    month = [request.args.get("month", default=None, type=int)]

    # parse origin airport parameters
    origin = dict()
    origin.update({"country": [request.args.get('origin_country', default=None, type=str)]})
    origin.update({"state_code": [request.args.get('origin_state', default=None, type=str)]})
    origin.update({"city": [request.args.get('origin_city', default=None, type=str)]})
    origin.update({"airport_code": [request.args.get('origin_airport_code', default=None, type=str)]})

    # parse destination airport parameter
    dest = dict()
    dest.update({"country": [request.args.get('dest_country', default=None, type=str)]})
    dest.update({"state_code": [request.args.get('dest_state', default=None, type=str)]})
    dest.update({"city": [request.args.get('dest_city', default=None, type=str)]})
    dest.update({"airport_code": [request.args.get('dest_airport_code', default=None, type=str)]})

    # parse career
    carrier = dict()
    carrier.update({"code": [request.args.get("carrier_code", default=None, type=str)]})
    carrier.update({"name": [request.args.get("carrier_name", default=None, type=str)]})

    d = query_topn_outgoing_by_airport(year=year,
                                       airport_code=airport_code,
                                       sort_by=sort_by,
                                       month=month,
                                       origin=origin,
                                       dest=dest,
                                       carrier=carrier,
                                       topn=TOPN)

    return jsonify(d)


@app.route("/data/carrier/out/topn_stats.json/<year>/<sort_by>")
def get_topn_carrier_outgoing_stats(year, sort_by):

    # parse month
    month = [request.args.get("month", default=None, type=int)]

    # parse origin airport parameters
    origin = dict()
    origin.update({"country": [request.args.get('origin_country', default=None, type=str)]})
    origin.update({"state_code": [request.args.get('origin_state', default=None, type=str)]})
    origin.update({"city": [request.args.get('origin_city', default=None, type=str)]})
    origin.update({"airport_code": [request.args.get('origin_airport_code', default=None, type=str)]})

    # parse destination airport parameter
    dest = dict()
    dest.update({"country": [request.args.get('dest_country', default=None, type=str)]})
    dest.update({"state_code": [request.args.get('dest_state', default=None, type=str)]})
    dest.update({"city": [request.args.get('dest_city', default=None, type=str)]})
    dest.update({"airport_code": [request.args.get('dest_airport_code', default=None, type=str)]})

    # parse career
    carrier = dict()
    carrier.update({"code": [request.args.get("carrier_code", default=None, type=str)]})
    carrier.update({"name": [request.args.get("carrier_name", default=None, type=str)]})

    d = query_topn_outgoing_by_carrier(year=year,
                                       sort_by=sort_by,
                                       month=month,
                                       origin=origin,
                                       dest=dest,
                                       carrier=carrier,
                                       topn=TOPN)
    return jsonify(d)

