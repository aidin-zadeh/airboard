
import os, inspect
import pandas as pd
import numpy as np

# get pathes to current and root dirs
CURR_DIR = os.path.dirname(inspect.getabsfile(inspect.currentframe()))
ROOT_DIR = os.path.dirname(CURR_DIR)


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

