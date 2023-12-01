#!/usr/bin/env python
import os
import pickle
import numpy as np
import pandas as pd

from flask import Flask
from flask import jsonify, request
from flask_cors import CORS
from pandas import json_normalize

with open('assets/logreg_model.pkl', 'rb') as file:
    model = pickle.load(file)

with open('assets/encoder.pkl', 'rb') as file:
    encoder = pickle.load(file)


def create_app():
    app = Flask(__name__)
    CORS(app)

    @app.route('/hello')
    def hello():
        return jsonify(message='Hello, from ml serv!')

    @app.route('/predict', methods=['POST'])
    def predict():
        data = request.get_json(force=True)

        profile_data = json_normalize(data['profile'])
        print(profile_data)

        profile_data = profile_data.astype('object')
        print(profile_data)

        profile_data_encoded = encoder.transform(profile_data)
        print(profile_data_encoded)
        prediction = model.predict(profile_data_encoded)
        print(prediction)
        prediction_list = prediction.tolist()
        print(prediction_list)
        result = jsonify(prediction=prediction_list)
        print(result)

        return result

    return app


if __name__ == "__main__":
    app = create_app()

    app.run(host='0.0.0.0',  port=os.environ.get(
        "FLASK_SERVER_PORT", 6000), debug=True)
