#!/usr/bin/env python
import os

from flask import Flask
from flasgger import Swagger
from pymongo import MongoClient

from api.route.accidentRessource import accident_api
from api.route.routeRessource import route_api
from api.route.profilRessource import profil_api
from api.route.risqueRessource import risk_api
from flask_cors import CORS


def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config['SWAGGER'] = {
        'title': 'Flask API Starter Kit',
    }

    swagger = Swagger(app)
    # Initialize Config
    app.config.from_pyfile('config.py')
    client = MongoClient(app.config['MONGODB_URI'])

    app.register_blueprint(accident_api, url_prefix='/api/accidents')
    app.register_blueprint(route_api, url_prefix='/api/route')
    app.register_blueprint(profil_api, url_prefix='/api/profil')
    app.register_blueprint(risk_api, url_prefix='/api/risk')
    return app


if __name__ == "__main__":
    app = create_app()

    app.run(host='0.0.0.0',  port=os.environ.get(
        "FLASK_SERVER_PORT", 9090), debug=True)
