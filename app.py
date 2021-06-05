import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify
from sqlalchemy import create_engine

from flask import Response,json

from flask import Flask, jsonify

#from flask_cors import CORS, cross_origin

from flask import Flask, render_template



engine = create_engine("postgresql://adojvxmfrwsgyy:14c495164667d4c88d2054b812e118e446a166ec9760da7f98c8855ee0e789cc@ec2-23-23-128-222.compute-1.amazonaws.com:5432/dd6qmuecuuhqju")



# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)

# Save reference to the table

results = engine.execute("select * from netflix").fetchall()


data_list = []

for i in results:
    a = {"Show_id":i[1],"Type":i[2],"Title":i[3],"Director":i[4],"Cast":i[5],"Country_name":i[6],"Date_added":i[7],"Release_year":i[8],"Rating":i[9],"Duration":i[10],"Listed_in":i[11],"Description":i[12],"Country":i[13],"Latitude":i[14],"Longitude":i[15]}
    
    data_list.append(a)



#################################################
# Flask Setup
#################################################
app = Flask(__name__)


#################################################
# Flask Routes
#################################################


@app.route("/")
def index():
    return render_template("index.html")

@app.route("/test", methods=["GET"])
def welcome():
    """List all available api routes."""
    
    return (jsonify(data_list))


if __name__ == '__main__':
    app.run(debug=True)
