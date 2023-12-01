from http import HTTPStatus
from flask import Blueprint, jsonify, request
from flasgger import swag_from
import requests
from api.service.profilService import ProfilService
from api.service.routeService import RouteService
from api.service.risqueService import RisqueService
from os import path
from dotenv import load_dotenv
import os

risk_api = Blueprint('risk', __name__)

basedir = path.abspath(path.join(path.dirname(__file__), '../..'))
load_dotenv(path.join(basedir, '.env'))

api_key = os.getenv('OPENROUTE_API_KEY')
if not api_key:
    raise ValueError("OPENROUTE_API_KEY not found in .env file")

risk_service = RisqueService(api_key)
profil_service = ProfilService()
route_service = RouteService(api_key)

ml_url = os.getenv('ML_URL')


@risk_api.route('/calculate-risk', methods=['GET'])
@swag_from({
    'parameters': [
        {
            'name': 'start_address',
            'in': 'query',
            'type': 'string',
            'required': True,
            'description': 'The start address of the route.',
            'example': '123 Main St'
        },
        {
            'name': 'end_address',
            'in': 'query',
            'type': 'string',
            'required': True,
            'description': 'The end address of the route.',
            'example': '456 Oak St'
        },
        {
            'name': 'age',
            'in': 'query',
            'type': 'integer',
            'required': True,
            'description': 'The age of the user.',
            'example': 25
        },
        {
            'name': 'sexe',
            'in': 'query',
            'type': 'integer',
            'required': True,
            'description': 'The gender of the user. 1 for male, 2 for female.',
            'example': 1
        },
        {
            'name': 'trajet',
            'in': 'query',
            'type': 'integer',
            'required': True,
            'description': 'The type of the journey.',
            'example': 1
        },
    ],
    'responses': {
        HTTPStatus.OK.value: {
            'description': 'Calculate risk for a route',
            'schema': {
                'type': 'object',
                'properties': {
                    'risk': {'type': 'float', 'example': 0.75},
                }
            }
        },
        HTTPStatus.BAD_REQUEST.value: {
            'description': 'Invalid input data',
            'schema': {
                'type': 'object',
                'properties': {
                    'error': {'type': 'string', 'example': 'Invalid input data'},
                }
            }
        },
    }
})
def calculateRisk():
    try:
        start_address = request.args.get('start_address')
        end_address = request.args.get('end_address')
        sexe = int(request.args.get('sexe'))
        age = int(request.args.get('age'))
        trajet = int(request.args.get('trajet'))
        catv = int(request.args.get('catv'))

        route = route_service.get_route(start_address, end_address)

        departments_weather, departments_lum = route_service.get_departments_weather(
            route)

        profile = profil_service.create_user_profile(
            sexe, age, trajet, departments_lum, departments_weather, catv)

        data = {'profile': [profile]}

        response = requests.post(f"{ml_url}/predict", json=data)

        if response.status_code != 200:
            raise Exception("ML API request failed")

        prediction = response.json()['prediction']

        risk, route, departement = risk_service.calculate_risk_score(
            route, profile)

        return jsonify({'risk': risk.to_json(orient='records'), 'departement': departement, 'route': route, 'profile': profile, 'prediction': prediction}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400
