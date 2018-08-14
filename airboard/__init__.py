
from flask import Flask


# set up Flask web server
app = Flask(__name__)

app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
from airboard import views

