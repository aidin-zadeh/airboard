
import os, inspect


# get pathes to current and root dirs
CURR_DIR = os.path.dirname(inspect.getabsfile(inspect.currentframe()))
ROOT_DIR = os.path.dirname(CURR_DIR)


DB_VERSION = 0

fname = os.path.join(ROOT_DIR,
                     "data",
                     "ext",
                     f"616181125_T_T100D_MARKET_ALL_CARRIER_CLEAN_10TO18_V{DB_VERSION}.sqlite")

DB_URI = f"sqlite:///{fname}"
