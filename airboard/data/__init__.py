
import os, inspect
import pandas as pd
from time import time
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, scoped_session
from sqlalchemy import (
    create_engine,
    func,
    desc,
    Column,
    Integer)
from sqlalchemy.sql import label
from airboard.conf import DB_URI
from pprint import pprint


# get current dir
CURR_DIR = os.path.dirname(inspect.getabsfile(inspect.currentframe()))
ROOT_DIR = os.path.dirname(CURR_DIR)

# create sqlite engine and connect to data base
engine = create_engine(DB_URI)
Base = declarative_base(engine)

# create session
session = scoped_session(sessionmaker(bind=engine))# year = 2010
# origin = {"country": [None], "state_code": ["TX"], "city": ["Austin"]}
# dest = {"country": [None], "state_code": [None], "city": [None]}
# carrier = {"name": [None]}
# sort_by = ["passengers", "mail"]
#
# YTable = create_table(year)
#
# sel = [
#     YTable.MONTH,
#     YTable.ORIGIN_AIRPORT_ID,
#     YTable.DEST_AIRPORT_ID,
#     # AirportTable.AIRPORT_ID,
#     AirportTable.AIRPORT_STATE_CODE,
#     label("TOTAL_DISTANCE", func.avg(YTable.DISTANCE)),
#     label("TOTAL_PASSENGERS", func.sum(YTable.PASSENGERS)),
#     label("TOTAL_FREIGHT", func.sum(YTable.FREIGHT)),
#     label("TOTAL_MAIL", func.sum(YTable.MAIL)),
# ]

# columns_to_groupby = [YTable.MONTH,
#                       YTable.ORIGIN_AIRPORT_STATE_CODE,
#                       YTable.DEST_AIRPORT_STATE_CODE]
#
# columns_to_filter = []

# filter by origin airport
# if origin is not None:
#     if origin["country"][0] is not None:
#         columns_to_filter.append({"ORIGIN_AIRPORT_COUNTRY": origin["country"]})
#     if origin["state_code"][0] is not None:
#         columns_to_filter.append({"ORIGIN_AIRPORT_STATE_CODE": origin["state_code"]})
#     if origin["city"][0] is not None:
#         columns_to_filter.append({"ORIGIN_AIRPORT_CITY": origin["city"]})
#
# # filter by destination airport
# if origin is not None:
#     if origin["country"][0] is not None:
#         columns_to_filter.append({"DEST_AIRPORT_COUNTRY": origin["country"]})
#     if dest["state_code"][0] is not None:
#         columns_to_filter.append({"DEST_AIRPORT_STATE_CODE": dest["state_code"]})
#     if dest["city"][0] is not None:
#         columns_to_filter.append({"DEST_AIRPORT_CITY": dest["city"]})
#
# # filter by carrier
# if carrier is not None:
#     if carrier["name"][0] is not None:
#         columns_to_filter.append({"UNIQUE_CARRIER_NAME": carrier["name"]})

# # query for response
# response = session.query(*sel) \
#     .group_by(*columns_to_groupby) \
#     .filter(*[getattr(YTable, list(elem.keys())[0]).in_(list(elem.values())[0])
#               for elem in columns_to_filter])
# sort response
# if sort_by and sort_by[0]:
#     response = response.order_by(
#         *[desc(f"TOTAL_{elem.upper()}") for elem in sort_by])



# response = session.query(*sel) \
#     .filter(YTable.ORIGIN_AIRPORT_ID == AirportTable.AIRPORT_ID) \
#     .group_by(AirportTable.AIRPORT_STATE_CODE) \
#     .all()

#
# class AirportTable(Base):
#     __tablename__ = "AIRPORTS"
#     __table_args__ = {"autoload": True, "extend_existing": True}
#     id = Column(Integer, primary_key=True)
#
#
# class StateCoord(Base):
#     __tablename__ = "STATES_COORD"
#     __table_args__ = {"autoload": True, "extend_existing": True}
#     id = Column(Integer, primary_key=True)


def create_table(year):
    # db.metadata.reflect(engine=engine)
    table_name = f"Y{year}"
    bases = (Base,)
    attrs = {
        "__tablename__": table_name,
        "__table_args__": {"autoload": True, "extend_existing": True},
        "id": Column(Integer, primary_key=True)
    }

    return type(f"{table_name}Table", bases, attrs)


def read_csv(year,
             month=None,
             origin=None,
             dest=None,
             carrier=None):

    fname = f"{year}_616181125_T_T100D_MARKET_ALL_CARRIER_CLEAN.csv"
    ffname = os.path.join(CURR_DIR, "ext", fname)
    df = pd.read_csv(ffname).iloc[:, 1:]

    # filter by month
    if month is not None:
        df = df.loc[df["MONTH"].values == month]
    print(df.shape)
    # filter by origin airport
    if origin is not None:
        if origin["country"][0] is not None:
            df = df.loc[df["ORIGIN_AIRPORT_COUNTRY"].isin(origin["country"])]
        if origin["state_code"][0] is not None:
            df = df.loc[df["ORIGIN_AIRPORT_STATE_CODE"].isin(origin["state_code"])]
        if origin["city"][0] is not None:
            df = df.loc[df["ORIGIN_AIRPORT_CITY"].isin(origin["city"])]

    # filter by destination airport
    if dest is not None:
        if dest["country"][0] is not None:
            df = df.loc[df["DEST_AIRPORT_COUNTRY"].isin(dest["country"])]
        if dest["state_code"][0] is not None:
            df = df.loc[df["DEST_AIRPORT_STATE_CODE"].isin(dest["state_code"])]
        if dest["city"][0] is not None:
            df = df.loc[df["DEST_AIRPORT_CITY"].isin(dest["city"])]

    # filter by carrier
    if carrier is not None:
        if carrier["name"][0] is not None:
            df = df.loc[df["UNIQUE_CARRIER_NAME"].isin(carrier["name"])]

    print(df.shape)

    return df.to_json(orient="records")


def parse_columns_to_filter(month, origin, dest, carrier):
    columns_to_filter = []

    # filter by month
    if month is not None:
        if month[0] is not None:
            columns_to_filter.append({"MONTH": month})

    # filter by origin airport
    if origin is not None:
        if origin["country"][0] is not None:
            columns_to_filter.append({"ORIGIN_COUNTRY": origin["country"]})
        if origin["state_code"][0] is not None:
            columns_to_filter.append({"ORIGIN_STATE_CODE": origin["state_code"]})
        if origin["city"][0] is not None:
            columns_to_filter.append({"ORIGIN_CITY": origin["city"]})
        if origin["airport_code"][0] is not None:
            columns_to_filter.append({"ORIGIN_AIRPORT_CODE": origin["airport_code"]})

    # filter by destination airport
    if dest is not None:
        if dest["country"][0] is not None:
            columns_to_filter.append({"DEST_COUNTRY": dest["country"]})
        if dest["state_code"][0] is not None:
            columns_to_filter.append({"DEST_STATE_CODE": dest["state_code"]})
        if dest["city"][0] is not None:
            columns_to_filter.append({"DEST_CITY": dest["city"]})
        if dest["airport_code"][0] is not None:
            columns_to_filter.append({"DEST_AIRPORT_CODE": dest["airport_code"]})

    # filter by carrier
    if carrier is not None:
        if carrier["code"][0] is not None:
            columns_to_filter.append({"UNIQUE_CARRIER": carrier["code"]})
        if carrier["name"][0] is not None:
            columns_to_filter.append({"UNIQUE_CARRIER_NAME": carrier["name"]})

    return columns_to_filter


def query_stats_by_state(year,
                         month=None,
                         origin=None,
                         dest=None,
                         carrier=None,
                         sort_by=None):

    if not hasattr(sort_by, "__iter__"):
        sort_by = [sort_by]
    # reflect table
    YTable = create_table(year)

    sel = [
        YTable.ORIGIN_COUNTRY,
        YTable.ORIGIN_STATE_CODE,
        label("ORIGIN_AVG_LATITUDE", func.avg(YTable.ORIGIN_LATITUDE)),
        label("ORIGIN_AVG_LONGITUDE", func.avg(YTable.ORIGIN_LONGITUDE)),
        YTable.DEST_COUNTRY,
        YTable.DEST_STATE_CODE,
        label("DEST_AVG_LATITUDE", func.avg(YTable.DEST_LATITUDE)),
        label("DEST_AVG_LONGITUDE", func.avg(YTable.DEST_LONGITUDE)),
        YTable.MONTH,
        label("Flight_COUNT", func.count(YTable.DEST_STATE_CODE)),
        label("TOTAL_DISTANCE", func.avg(YTable.DISTANCE)),
        label("TOTAL_PASSENGERS", func.sum(YTable.PASSENGERS)),
        label("TOTAL_FREIGHT", func.sum(YTable.FREIGHT)),
        label("TOTAL_MAIL", func.sum(YTable.MAIL)),
    ]

    # set columns to group by
    columns_to_groupby = [
        YTable.ORIGIN_COUNTRY,
        YTable.ORIGIN_STATE_CODE,
        YTable.DEST_COUNTRY,
        YTable.DEST_STATE_CODE,
        YTable.MONTH,
    ]

    # get columns to filter by
    columns_to_filter = parse_columns_to_filter(month, origin, dest, carrier)

    # query for response
    response = session.query(*sel) \
        .filter(*[getattr(YTable, list(elem.keys())[0]).in_(list(elem.values())[0])
                  for elem in columns_to_filter]) \
        .group_by(*columns_to_groupby)
    # sort response
    if sort_by and sort_by[0]:
        response = response.order_by(
            *[desc(f"TOTAL_{elem.upper()}") for elem in sort_by])

    d = dict()
    for x in response:
        key_origin = f"{x[0]},{x[1]}".replace(" ", "")

        if key_origin not in d:
            d[key_origin] = dict()
            d[key_origin]["country"] = x[0]
            d[key_origin]["state_code"] = x[1]
            d[key_origin]["latitude"] = x[2]
            d[key_origin]["longitude"] = x[3]
            d[key_origin]["dest"] = {}

        key_dest = f"{x[4]},{x[5]}".replace(" ", "")
        if key_dest not in d[key_origin]["dest"]:
            d[key_origin]["dest"][key_dest] = dict()
            d[key_origin]["dest"][key_dest]["country"] = x[4]
            d[key_origin]["dest"][key_dest]["state_code"] = x[5]
            d[key_origin]["dest"][key_dest]["latitude"] = x[6]
            d[key_origin]["dest"][key_dest]["longitude"] = x[7]
            d[key_origin]["dest"][key_dest]["month"] = []
            d[key_origin]["dest"][key_dest]["flight_count"] = []
            d[key_origin]["dest"][key_dest]["total_distance"] = []
            d[key_origin]["dest"][key_dest]["total_passengers"] = []
            d[key_origin]["dest"][key_dest]["total_freight"] = []
            d[key_origin]["dest"][key_dest]["total_mail"] = []

        d[key_origin]["dest"][key_dest]["month"].append(x[8])
        d[key_origin]["dest"][key_dest]["flight_count"].append(x[9])
        d[key_origin]["dest"][key_dest]["total_distance"].append(x[10])
        d[key_origin]["dest"][key_dest]["total_passengers"].append(x[11])
        d[key_origin]["dest"][key_dest]["total_freight"].append(x[12])
        d[key_origin]["dest"][key_dest]["total_mail"].append(x[13])

    return d


def query_stats_by_city(year,
                        month=None,
                        origin=None,
                        dest=None,
                        carrier=None,
                        sort_by=None):

    if not hasattr(sort_by, "__iter__"):
        sort_by = [sort_by]

    # reflect table
    YTable = create_table(year)
    sel = [
        YTable.ORIGIN_COUNTRY,
        YTable.ORIGIN_STATE_CODE,
        YTable.ORIGIN_CITY,
        label("ORIGIN_AVG_LATITUDE", func.avg(YTable.ORIGIN_LATITUDE)),
        label("ORIGIN_AVG_LONGITUDE", func.avg(YTable.ORIGIN_LONGITUDE)),
        YTable.DEST_COUNTRY,
        YTable.DEST_STATE_CODE,
        YTable.DEST_CITY,
        label("DEST_AVG_LATITUDE", func.avg(YTable.DEST_LATITUDE)),
        label("DEST_AVG_LONGITUDE", func.avg(YTable.DEST_LONGITUDE)),
        YTable.MONTH,
        label("Flight_COUNT", func.count(YTable.DEST_AIRPORT_CODE)),
        label("TOTAL_DISTANCE", func.avg(YTable.DISTANCE)),
        label("TOTAL_PASSENGERS", func.sum(YTable.PASSENGERS)),
        label("TOTAL_FREIGHT", func.sum(YTable.FREIGHT)),
        label("TOTAL_MAIL", func.sum(YTable.MAIL)),
    ]
    # get columns to filter by
    columns_to_filter = parse_columns_to_filter(month, origin, dest, carrier)
    # get columns to group by
    columns_to_groupby = [
        YTable.ORIGIN_COUNTRY,
        YTable.ORIGIN_STATE_CODE,
        YTable.ORIGIN_CITY,
        YTable.MONTH,
        YTable.DEST_COUNTRY,
        YTable.DEST_STATE_CODE,
        YTable.DEST_CITY,
    ]

    # query for response
    response = session.query(*sel) \
        .filter(*[getattr(YTable, list(elem.keys())[0]).in_(list(elem.values())[0])
                  for elem in columns_to_filter]) \
        .group_by(*columns_to_groupby)
    # sort response
    if sort_by and sort_by[0]:
        response = response.order_by(
            *[desc(f"TOTAL_{elem.upper()}") for elem in sort_by])

    d = dict()
    for x in response:
        key_origin = f"{x[0]},{x[1]},{x[2]}".replace(" ", "")

        if key_origin not in d:
            d[key_origin] = dict()
            d[key_origin]["country"] = x[0]
            d[key_origin]["state_code"] = x[1]
            d[key_origin]["city"] = x[2]
            d[key_origin]["latitude"] = x[3]
            d[key_origin]["longitude"] = x[4]
            d[key_origin]["dest"] = dict()

        key_dest = f"{x[5]},{x[6]},{x[7]}".replace(" ", "")
        if key_dest not in d[key_origin]["dest"]:
            d[key_origin]["dest"][key_dest] = dict()
            d[key_origin]["dest"][key_dest]["country"] = x[5]
            d[key_origin]["dest"][key_dest]["state_code"] = x[6]
            d[key_origin]["dest"][key_dest]["city"] = x[7]
            d[key_origin]["dest"][key_dest]["latitude"] = x[8]
            d[key_origin]["dest"][key_dest]["longitude"] = x[9]
            d[key_origin]["dest"][key_dest]["month"] = []
            d[key_origin]["dest"][key_dest]["flight_count"] = []
            d[key_origin]["dest"][key_dest]["total_distance"] = []
            d[key_origin]["dest"][key_dest]["total_passengers"] = []
            d[key_origin]["dest"][key_dest]["total_freight"] = []
            d[key_origin]["dest"][key_dest]["total_mail"] = []

        d[key_origin]["dest"][key_dest]["month"].append(x[10])
        d[key_origin]["dest"][key_dest]["flight_count"].append(x[11])
        d[key_origin]["dest"][key_dest]["total_distance"].append(x[12])
        d[key_origin]["dest"][key_dest]["total_passengers"].append(x[13])
        d[key_origin]["dest"][key_dest]["total_freight"].append(x[14])
        d[key_origin]["dest"][key_dest]["total_mail"].append(x[15])
    return d


def query_stats_by_airport(year,
                           month=None,
                           origin=None,
                           dest=None,
                           carrier=None,
                           sort_by=None):

    if not hasattr(sort_by, "__iter__"):
        sort_by = [sort_by]

    # reflect table
    YTable = create_table(year)
    sel = [
        YTable.ORIGIN_AIRPORT_CODE,
        YTable.ORIGIN_LATITUDE,
        YTable.ORIGIN_LONGITUDE,
        YTable.DEST_AIRPORT_CODE,
        YTable.DEST_LATITUDE,
        YTable.DEST_LONGITUDE,
        YTable.MONTH,
        label("Flight_COUNT", func.count(YTable.DEST_AIRPORT_CODE)),
        label("TOTAL_DISTANCE", func.avg(YTable.DISTANCE)),
        label("TOTAL_PASSENGERS", func.sum(YTable.PASSENGERS)),
        label("TOTAL_FREIGHT", func.sum(YTable.FREIGHT)),
        label("TOTAL_MAIL", func.sum(YTable.MAIL)),
    ]

    # get columns to filter by
    columns_to_filter = parse_columns_to_filter(month, origin, dest, carrier)
    # get columns to group by
    columns_to_groupby = [
        YTable.ORIGIN_AIRPORT_CODE,
        YTable.MONTH,
        YTable.DEST_AIRPORT_CODE,
    ]

    # query for response
    response = session.query(*sel) \
        .filter(*[getattr(YTable, list(elem.keys())[0]).in_(list(elem.values())[0])
                  for elem in columns_to_filter]) \
        .group_by(*columns_to_groupby)
    # sort response
    if sort_by and sort_by[0]:
        response = response.order_by(
            *[desc(f"TOTAL_{elem.upper()}") for elem in sort_by])
    # transform response to dict
    d = dict()
    for x in response:
        key_origin = f"{x[0]}".replace(" ", "")

        if key_origin not in d:
            d[key_origin] = dict()
            d[key_origin]["airport_code"] = x[0]
            d[key_origin]["latitude"] = x[1]
            d[key_origin]["longitude"] = x[2]
            d[key_origin]["dest"] = dict()

        key_dest = f"{x[3]}".replace(" ", "")
        if key_dest not in d[key_origin]["dest"]:
            d[key_origin]["dest"][key_dest] = dict()
            d[key_origin]["dest"][key_dest]["airport_code"] = x[3]
            d[key_origin]["dest"][key_dest]["latitude"] = x[4]
            d[key_origin]["dest"][key_dest]["longitude"] = x[5]
            d[key_origin]["dest"][key_dest]["month"] = []
            d[key_origin]["dest"][key_dest]["flight_count"] = []
            d[key_origin]["dest"][key_dest]["total_distance"] = []
            d[key_origin]["dest"][key_dest]["total_passengers"] = []
            d[key_origin]["dest"][key_dest]["total_freight"] = []
            d[key_origin]["dest"][key_dest]["total_mail"] = []

        d[key_origin]["dest"][key_dest]["month"].append(x[6])
        d[key_origin]["dest"][key_dest]["flight_count"].append(x[7])
        d[key_origin]["dest"][key_dest]["total_distance"].append(x[8])
        d[key_origin]["dest"][key_dest]["total_passengers"].append(x[9])
        d[key_origin]["dest"][key_dest]["total_freight"].append(x[10])
        d[key_origin]["dest"][key_dest]["total_mail"].append(x[11])
    return d


def query_topn_outgoing_by_state(year,
                                 state_code,
                                 sort_by,
                                 month=None,
                                 origin=None,
                                 dest=None,
                                 carrier=None,
                                 topn=10):

    sort_by = [sort_by]
    state_code = [state_code]
    # reflect table
    YTable = create_table(year)

    sel = [
        YTable.ORIGIN_COUNTRY,
        YTable.ORIGIN_STATE_CODE,
        label("ORIGIN_AVG_LATITUDE", func.avg(YTable.ORIGIN_LATITUDE)),
        label("ORIGIN_AVG_LONGITUDE", func.avg(YTable.ORIGIN_LONGITUDE)),
        YTable.DEST_COUNTRY,
        YTable.DEST_STATE_CODE,
        label("DEST_AVG_LATITUDE", func.avg(YTable.DEST_LATITUDE)),
        label("DEST_AVG_LONGITUDE", func.avg(YTable.DEST_LONGITUDE)),
        label("Flight_COUNT", func.count(YTable.DEST_STATE_CODE)),
        label("TOTAL_DISTANCE", func.avg(YTable.DISTANCE)),
        label("TOTAL_PASSENGERS", func.sum(YTable.PASSENGERS)),
        label("TOTAL_FREIGHT", func.sum(YTable.FREIGHT)),
        label("TOTAL_MAIL", func.sum(YTable.MAIL)),
    ]

    # set columns to group by
    columns_to_groupby = [
        YTable.DEST_COUNTRY,
        YTable.DEST_STATE_CODE,
    ]

    # get columns to filter by
    columns_to_filter = parse_columns_to_filter(month, origin, dest, carrier)

    # query for response
    response = session.query(*sel) \
        .filter(YTable.ORIGIN_STATE_CODE.in_(state_code),
                *[getattr(YTable, list(elem.keys())[0]).in_(list(elem.values())[0])
                  for elem in columns_to_filter]) \
        .group_by(*columns_to_groupby)
    # sort response
    if sort_by and sort_by[0]:
        response = response.order_by(
            *[desc(f"TOTAL_{elem.upper()}") for elem in sort_by])

    d = dict()

    x = response[0]
    origin_uid = "origin"
    d[origin_uid] = dict()
    d[origin_uid]["country"] = x[0]
    d[origin_uid]["state_code"] = x[1]
    d[origin_uid]["latitude"] = x[2]
    d[origin_uid]["longitude"] = x[3]
    d[origin_uid]["TOPN"] = topn
    d[origin_uid]["uid"] = origin_uid
    d[origin_uid]["dest"] = []
    # pprint(response.all())
    counter = 0
    for x in response:
        if counter < topn:
            dest_uid = f"{x[4]},{x[5]}".replace(" ", "")
            elem = dict()
            elem["uid"] = dest_uid
            elem["country"] = x[4]
            elem["state"] = x[5]
            elem["latitude"] = x[6]
            elem["longitude"] = x[7]
            elem["flight_count"] = x[8]
            elem["total_distance"] = x[9]
            elem["total_passengers"] = x[10]
            elem["total_freight"] = x[11]
            elem["total_mail"] = x[12]
            d[origin_uid]["dest"].append(elem)
        elif counter == topn:
            dest_uid = "other"
            elem = dict()
            elem["uid"] = dest_uid
            elem["country"] = ""
            elem["state"] = "Other"
            elem["flight_count"] = x[8]
            elem["total_distance"] = x[9]
            elem["total_passengers"] = x[10]
            elem["total_freight"] = x[11]
            elem["total_mail"] = x[12]
            d[origin_uid]["dest"].append(elem)
        else:
            d[origin_uid]["dest"][-1]["flight_count"] += x[8]
            d[origin_uid]["dest"][-1]["total_distance"] += x[9]
            d[origin_uid]["dest"][-1]["total_passengers"] += x[10]
            d[origin_uid]["dest"][-1]["total_freight"] += x[11]
            d[origin_uid]["dest"][-1]["total_mail"] += x[12]
        counter += 1
    return d


def query_topn_outgoing_by_city(year,
                                city,
                                sort_by,
                                month=None,
                                origin=None,
                                dest=None,
                                carrier=None,
                                topn=10):

    sort_by = [sort_by]
    city = [city]
    # reflect table
    YTable = create_table(year)

    sel = [
        # YTable.MONTH,
        YTable.ORIGIN_COUNTRY,
        YTable.ORIGIN_STATE_CODE,
        YTable.ORIGIN_CITY,
        label("ORIGIN_AVG_LATITUDE", func.avg(YTable.ORIGIN_LATITUDE)),
        label("ORIGIN_AVG_LONGITUDE", func.avg(YTable.ORIGIN_LONGITUDE)),
        YTable.DEST_COUNTRY,
        YTable.DEST_STATE_CODE,
        YTable.DEST_CITY,
        label("DEST_AVG_LATITUDE", func.avg(YTable.DEST_LATITUDE)),
        label("DEST_AVG_LONGITUDE", func.avg(YTable.DEST_LONGITUDE)),
        label("Flight_COUNT", func.count(YTable.DEST_STATE_CODE)),
        label("TOTAL_DISTANCE", func.avg(YTable.DISTANCE)),
        label("TOTAL_PASSENGERS", func.sum(YTable.PASSENGERS)),
        label("TOTAL_FREIGHT", func.sum(YTable.FREIGHT)),
        label("TOTAL_MAIL", func.sum(YTable.MAIL)),
    ]

    # set columns to group by
    columns_to_groupby = [
        YTable.DEST_CITY,
    ]

    # get columns to filter by
    columns_to_filter = parse_columns_to_filter(month, origin, dest, carrier)

    # query for response
    response = session.query(*sel) \
        .filter(YTable.ORIGIN_CITY.in_(city),
                *[getattr(YTable, list(elem.keys())[0]).in_(list(elem.values())[0])
                  for elem in columns_to_filter]) \
        .group_by(*columns_to_groupby)
    # sort response
    if sort_by and sort_by[0]:
        response = response.order_by(
            *[desc(f"TOTAL_{elem.upper()}") for elem in sort_by])

    d = dict()

    x = response[0]
    origin_uid = "origin"
    d[origin_uid] = dict()
    d[origin_uid]["country"] = x[0]
    d[origin_uid]["state_code"] = x[1]
    d[origin_uid]["city"] = x[2]
    d[origin_uid]["latitude"] = x[3]
    d[origin_uid]["longitude"] = x[4]
    d[origin_uid]["TOPN"] = topn
    d[origin_uid]["uid"] = origin_uid
    d[origin_uid]["dest"] = []
    # pprint(response.all())
    counter = 0
    for x in response:
        # print(counter)
        # print(x[10])
        # pprint(x)
        if counter < topn:
            dest_uid = f"{x[5]},{x[6]},{x[7]}".replace(" ", "")
            elem = dict()
            elem["uid"] = dest_uid
            elem["country"] = x[5]
            elem["state"] = x[6]
            elem["city"] = x[7]
            elem["latitude"] = x[8]
            elem["longitude"] = x[9]
            elem["flight_count"] = x[10]
            elem["total_distance"] = x[11]
            elem["total_passengers"] = x[12]
            elem["total_freight"] = x[13]
            elem["total_mail"] = x[14]
            d[origin_uid]["dest"].append(elem)
        elif counter == topn:
            dest_uid = "other"
            elem = dict()
            elem["uid"] = dest_uid
            elem["state"] = ""
            elem["city"] = "Other"
            elem["flight_count"] = x[10]
            elem["total_distance"] = x[11]
            elem["total_passengers"] = x[12]
            elem["total_freight"] = x[13]
            elem["total_mail"] = x[14]
            d[origin_uid]["dest"].append(elem)
        else:
            d[origin_uid]["dest"][-1]["flight_count"] += x[10]
            d[origin_uid]["dest"][-1]["total_distance"] += x[11]
            d[origin_uid]["dest"][-1]["total_passengers"] += x[12]
            d[origin_uid]["dest"][-1]["total_freight"] += x[13]
            d[origin_uid]["dest"][-1]["total_mail"] += x[14]
        counter += 1
    return d


def query_topn_outgoing_by_airport(year,
                                airport_code,
                                sort_by,
                                month=None,
                                origin=None,
                                dest=None,
                                carrier=None,
                                topn=10):

    sort_by = [sort_by]
    airport_code = [airport_code]
    # reflect table
    YTable = create_table(year)

    sel = [
        YTable.ORIGIN_COUNTRY,
        YTable.ORIGIN_STATE_CODE,
        YTable.ORIGIN_CITY,
        YTable.ORIGIN_AIRPORT_CODE,
        YTable.ORIGIN_LATITUDE,
        YTable.ORIGIN_LONGITUDE,
        YTable.DEST_COUNTRY,
        YTable.DEST_STATE_CODE,
        YTable.DEST_CITY,
        YTable.DEST_AIRPORT_CODE,
        YTable.DEST_LATITUDE,
        YTable.DEST_LONGITUDE,
        label("Flight_COUNT", func.count(YTable.DEST_STATE_CODE)),
        label("TOTAL_DISTANCE", func.avg(YTable.DISTANCE)),
        label("TOTAL_PASSENGERS", func.sum(YTable.PASSENGERS)),
        label("TOTAL_FREIGHT", func.sum(YTable.FREIGHT)),
        label("TOTAL_MAIL", func.sum(YTable.MAIL)),
    ]

    # set columns to group by
    columns_to_groupby = [YTable.DEST_AIRPORT_CODE,]

    # get columns to filter by
    columns_to_filter = parse_columns_to_filter(month, origin, dest, carrier)

    # query for response
    response = session.query(*sel) \
        .filter(YTable.ORIGIN_AIRPORT_CODE.in_(airport_code),
                *[getattr(YTable, list(elem.keys())[0]).in_(list(elem.values())[0])
                  for elem in columns_to_filter]) \
        .group_by(*columns_to_groupby)
    # sort response
    if sort_by and sort_by[0]:
        response = response.order_by(
            *[desc(f"TOTAL_{elem.upper()}") for elem in sort_by])

    d = dict()

    x = response[0]
    origin_uid = "origin"
    d[origin_uid] = dict()
    d[origin_uid]["country"] = x[0]
    d[origin_uid]["state_code"] = x[1]
    d[origin_uid]["city"] = x[2]
    d[origin_uid]["airport_code"] = x[3]
    d[origin_uid]["latitude"] = x[4]
    d[origin_uid]["longitude"] = x[5]
    d[origin_uid]["TOPN"] = topn
    d[origin_uid]["uid"] = origin_uid
    d[origin_uid]["dest"] = []
    # pprint(response.all())
    counter = 0
    for x in response:
        # print(counter)
        # print(x[10])
        # pprint(x)
        if counter < topn:
            dest_uid = f"{x[9]}".replace(" ", "")
            elem = dict()
            elem["uid"] = dest_uid
            elem["country"] = x[6]
            elem["state"] = x[7]
            elem["city"] = x[8]
            elem["airport_code"] = x[9]
            elem["latitude"] = x[10]
            elem["longitude"] = x[11]
            elem["flight_count"] = x[12]
            elem["total_distance"] = x[13]
            elem["total_passengers"] = x[14]
            elem["total_freight"] = x[15]
            elem["total_mail"] = x[16]
            d[origin_uid]["dest"].append(elem)
        elif counter == topn:
            dest_uid = "other"
            elem = dict()
            elem["uid"] = dest_uid
            elem["airport_code"] = "Other"
            elem["airport_code"] = "Other"
            elem["flight_count"] = x[12]
            elem["total_distance"] = x[13]
            elem["total_passengers"] = x[14]
            elem["total_freight"] = x[15]
            elem["total_mail"] = x[16]
            d[origin_uid]["dest"].append(elem)
        else:
            d[origin_uid]["dest"][-1]["flight_count"] += x[12]
            d[origin_uid]["dest"][-1]["total_distance"] += x[13]
            d[origin_uid]["dest"][-1]["total_passengers"] += x[14]
            d[origin_uid]["dest"][-1]["total_freight"] += x[15]
            d[origin_uid]["dest"][-1]["total_mail"] += x[16]
        counter += 1
    return d


def query_topn_outgoing_by_carrier(year,
                                   sort_by,
                                   month=None,
                                   origin=None,
                                   dest=None,
                                   carrier=None,
                                   topn=10):

    sort_by = [sort_by]
    # reflect table
    YTable = create_table(year)

    sel = [
        YTable.ORIGIN_COUNTRY,
        YTable.ORIGIN_STATE_CODE,
        YTable.ORIGIN_CITY,
        YTable.ORIGIN_AIRPORT_CODE,
        YTable.ORIGIN_LATITUDE,
        YTable.ORIGIN_LONGITUDE,
        YTable.UNIQUE_CARRIER,
        YTable.UNIQUE_CARRIER_NAME,
        label("Flight_COUNT", func.count(YTable.DEST_STATE_CODE)),
        label("TOTAL_DISTANCE", func.avg(YTable.DISTANCE)),
        label("TOTAL_PASSENGERS", func.sum(YTable.PASSENGERS)),
        label("TOTAL_FREIGHT", func.sum(YTable.FREIGHT)),
        label("TOTAL_MAIL", func.sum(YTable.MAIL)),
    ]

    # set columns to group by
    columns_to_groupby = [YTable.UNIQUE_CARRIER,]

    # get columns to filter by
    columns_to_filter = parse_columns_to_filter(month, origin, dest, carrier)

    # query for response
    response = session.query(*sel) \
        .filter(*[getattr(YTable, list(elem.keys())[0]).in_(list(elem.values())[0])
                  for elem in columns_to_filter]) \
        .group_by(*columns_to_groupby)
    # sort response
    if sort_by and sort_by[0]:
        response = response.order_by(
            *[desc(f"TOTAL_{elem.upper()}") for elem in sort_by])

    d = dict()

    x = response[0]
    origin_uid = "origin"
    d[origin_uid] = dict()
    d[origin_uid]["country"] = x[0]
    d[origin_uid]["state_code"] = x[1]
    d[origin_uid]["city"] = x[2]
    d[origin_uid]["airport_code"] = x[3]
    d[origin_uid]["latitude"] = x[4]
    d[origin_uid]["longitude"] = x[5]
    d[origin_uid]["TOPN"] = topn
    d[origin_uid]["uid"] = origin_uid
    d[origin_uid]["dest"] = []
    # pprint(response.all())
    counter = 0
    for x in response:
        # print(counter)
        # print(x[10])
        # pprint(x)
        if counter < topn:
            dest_uid = f"{x[6]}".replace(" ", "")
            elem = dict()
            elem["uid"] = dest_uid
            elem["carrier_code"] = x[6]
            elem["carrier_name"] = x[7]
            elem["flight_count"] = x[8]
            elem["total_distance"] = x[9]
            elem["total_passengers"] = x[10]
            elem["total_freight"] = x[11]
            elem["total_mail"] = x[12]
            d[origin_uid]["dest"].append(elem)
        elif counter == topn:
            dest_uid = "other"
            elem = dict()
            elem["uid"] = dest_uid
            elem["carrier_code"] = "Other"
            elem["carrier_name"] = "Other"
            elem["flight_count"] = x[8]
            elem["total_distance"] = x[9]
            elem["total_passengers"] = x[10]
            elem["total_freight"] = x[11]
            elem["total_mail"] = x[12]
            d[origin_uid]["dest"].append(elem)
        else:
            d[origin_uid]["dest"][-1]["flight_count"] += x[8]
            d[origin_uid]["dest"][-1]["total_distance"] += x[9]
            d[origin_uid]["dest"][-1]["total_passengers"] += x[10]
            d[origin_uid]["dest"][-1]["total_freight"] += x[11]
            d[origin_uid]["dest"][-1]["total_mail"] += x[12]
        counter += 1
    return d


def main():
    year = 2010
    origin = {"country": [None],
              "state_code": ["TX"],
              "city": ["Austin"],
              "airport_code": [None]}
    dest = {"country": [None],
            "state_code": [None],
            "city": [None],
            "airport_code": [None]}
    carrier = {"name": [None], "code": [None]}
    sort_by = [None]

    state_stats = query_stats_by_state(year,
                                       origin=origin,
                                       dest=dest,
                                       carrier=carrier,
                                       sort_by=sort_by)
    city_stats = query_stats_by_city(year,
                                     origin=origin,
                                     dest=dest,
                                     carrier=carrier,
                                     sort_by=sort_by)
    return state_stats, city_stats


if __name__ == "__main__":
    d_state, d_city = main()
    # print(len(rval))
    pprint(d_state)



