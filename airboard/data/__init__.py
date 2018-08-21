
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
session = scoped_session(sessionmaker(bind=engine))

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


def query_stats_by_state(year,
                         origin=None,
                         dest=None,
                         carrier=None,
                         sort_by=None):

    if not hasattr(sort_by, "__iter__"):
        sort_by = [sort_by]
    # reflect table
    YTable = create_table(year)

    sel = [
        YTable.ORIGIN_AIRPORT_COUNTRY,
        YTable.ORIGIN_AIRPORT_STATE_CODE,
        label("ORIGIN_AVG_LATITUDE", func.avg(YTable.ORIGIN_LATITUDE)),
        label("ORIGIN_AVG_LONGITUDE", func.avg(YTable.ORIGIN_LONGITUDE)),
        YTable.DEST_AIRPORT_COUNTRY,
        YTable.DEST_AIRPORT_STATE_CODE,
        label("DEST_AVG_LATITUDE", func.avg(YTable.DEST_LATITUDE)),
        label("DEST_AVG_LONGITUDE", func.avg(YTable.DEST_LONGITUDE)),
        YTable.MONTH,
        label("Flight_COUNT", func.count(YTable.DEST_AIRPORT_STATE_CODE)),
        label("TOTAL_DISTANCE", func.avg(YTable.DISTANCE)),
        label("TOTAL_PASSENGERS", func.sum(YTable.PASSENGERS)),
        label("TOTAL_FREIGHT", func.sum(YTable.FREIGHT)),
        label("TOTAL_MAIL", func.sum(YTable.MAIL)),
    ]

    columns_to_groupby = [
        YTable.ORIGIN_AIRPORT_COUNTRY,
        YTable.ORIGIN_AIRPORT_STATE_CODE,
        YTable.DEST_AIRPORT_COUNTRY,
        YTable.DEST_AIRPORT_STATE_CODE,
        YTable.MONTH,
    ]

    columns_to_filter = []

    # filter by origin airport
    if origin is not None:
        if origin["country"][0] is not None:
            columns_to_filter.append({"ORIGIN_AIRPORT_COUNTRY": origin["country"]})
        if origin["state_code"][0] is not None:
            columns_to_filter.append({"ORIGIN_AIRPORT_STATE_CODE": origin["state_code"]})
        if origin["city"][0] is not None:
            columns_to_filter.append({"ORIGIN_AIRPORT_CITY": origin["city"]})

    # filter by destination airport
    if dest is not None:
        if dest["country"][0] is not None:
            columns_to_filter.append({"DEST_AIRPORT_COUNTRY": dest["country"]})
        if dest["state_code"][0] is not None:
            columns_to_filter.append({"DEST_AIRPORT_STATE_CODE": dest["state_code"]})
        if dest["city"][0] is not None:
            columns_to_filter.append({"DEST_AIRPORT_CITY": dest["city"]})

    # filter by carrier
    if carrier is not None:
        if carrier["name"][0] is not None:
            columns_to_filter.append({"UNIQUE_CARRIER_NAME": carrier["name"]})

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
                        origin=None,
                        dest=None,
                        carrier=None,
                        sort_by=None):

    if not hasattr(sort_by, "__iter__"):
        sort_by = [sort_by]
    # reflect table
    YTable = create_table(year)

    sel = [
        YTable.ORIGIN_AIRPORT_COUNTRY,
        YTable.ORIGIN_AIRPORT_STATE_CODE,
        YTable.ORIGIN_AIRPORT_CITY,
        label("ORIGIN_AVG_LATITUDE", func.avg(YTable.ORIGIN_LATITUDE)),
        label("ORIGIN_AVG_LONGITUDE", func.avg(YTable.ORIGIN_LONGITUDE)),
        YTable.DEST_AIRPORT_COUNTRY,
        YTable.DEST_AIRPORT_STATE_CODE,
        YTable.DEST_AIRPORT_CITY,
        label("DEST_AVG_LATITUDE", func.avg(YTable.DEST_LATITUDE)),
        label("DEST_AVG_LONGITUDE", func.avg(YTable.DEST_LONGITUDE)),
        YTable.MONTH,
        label("Flight_COUNT", func.count(YTable.DEST_AIRPORT_STATE_CODE)),
        label("TOTAL_DISTANCE", func.avg(YTable.DISTANCE)),
        label("TOTAL_PASSENGERS", func.sum(YTable.PASSENGERS)),
        label("TOTAL_FREIGHT", func.sum(YTable.FREIGHT)),
        label("TOTAL_MAIL", func.sum(YTable.MAIL)),
    ]

    columns_to_groupby = [
        YTable.ORIGIN_AIRPORT_COUNTRY,
        YTable.ORIGIN_AIRPORT_STATE_CODE,
        YTable.ORIGIN_AIRPORT_CITY,
        YTable.MONTH,
        YTable.DEST_AIRPORT_COUNTRY,
        YTable.DEST_AIRPORT_STATE_CODE,
        YTable.DEST_AIRPORT_CITY,
    ]

    columns_to_filter = []

    # filter by origin airport
    if origin is not None:
        if origin["country"][0] is not None:
            columns_to_filter.append({"ORIGIN_AIRPORT_COUNTRY": origin["country"]})
        if origin["state_code"][0] is not None:
            columns_to_filter.append({"ORIGIN_AIRPORT_STATE_CODE": origin["state_code"]})
        if origin["city"][0] is not None:
            columns_to_filter.append({"ORIGIN_AIRPORT_CITY": origin["city"]})

    # filter by destination airport
    if dest is not None:
        if dest["country"][0] is not None:
            columns_to_filter.append({"DEST_AIRPORT_COUNTRY": dest["country"]})
        if dest["state_code"][0] is not None:
            columns_to_filter.append({"DEST_AIRPORT_STATE_CODE": dest["state_code"]})
        if dest["city"][0] is not None:
            columns_to_filter.append({"DEST_AIRPORT_CITY": dest["city"]})

    # filter by carrier
    if carrier is not None:
        if carrier["name"][0] is not None:
            columns_to_filter.append({"UNIQUE_CARRIER_NAME": carrier["name"]})

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

# year = 2010
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

def main():
    year = 2010
    origin = {"country": [None], "state_code": ["TX"], "city": ["Austin"]}
    dest = {"country": [None], "state_code": [None], "city": [None]}
    carrier = {"name": [None]}
    sort_by = [None]

    return query_stats_by_state(year, origin, dest, carrier, sort_by),\
           query_stats_by_city(year, origin, dest, carrier, sort_by)


if __name__ == "__main__":
    d = main()
    # print(len(rval))
    pprint(d)



