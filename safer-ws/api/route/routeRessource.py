import requests
from flask import Blueprint, jsonify
from flask import Blueprint, jsonify, request
from http import HTTPStatus
from ..service.routeService import RouteService
from os import path
from dotenv import load_dotenv
import os

basedir = path.abspath(path.join(path.dirname(__file__), '../..'))
load_dotenv(path.join(basedir, '.env'))

api_key = os.getenv('OPENROUTE_API_KEY')
if not api_key:
    raise ValueError("OPENROUTE_API_KEY not found in .env file")

ml_url = os.getenv('ML_URL')


route_service = RouteService(api_key)

route_api = Blueprint('route_api', __name__)


@route_api.route('/itineraire')
def get_route():
    try:
        start_address = request.args.get('start_address')
        end_address = request.args.get('end_address')

        route = route_service.get_route(start_address, end_address)

        return jsonify(route=route), HTTPStatus.OK

    except ValueError as e:
        return jsonify(message=str(e)), HTTPStatus.BAD_REQUEST

    except Exception as e:
        return jsonify(message=str(e)), HTTPStatus.INTERNAL_SERVER_ERROR


@route_api.route('/itineraire/departments-crossed-coordinates')
def get_departments_crossed_coordinates():
    try:
        start_address = request.args.get('start_address')
        end_address = request.args.get('end_address')

        route = route_service.get_route(start_address, end_address)

        crossed_departments_coordinates = route_service.get_departments_crossed_coordinates(
            route)

        return jsonify(crossed_departments_coordinates=crossed_departments_coordinates), HTTPStatus.OK

    except ValueError as e:
        return jsonify(message=str(e)), HTTPStatus.BAD_REQUEST

    except Exception as e:
        return jsonify(message=str(e)), HTTPStatus.INTERNAL_SERVER_ERROR


@route_api.route('/itineraire/departments-weather')
def get_departments_weather():
    try:
        start_address = request.args.get('start_address')
        end_address = request.args.get('end_address')

        route = route_service.get_route(start_address, end_address)

        departments_weather = route_service.get_departments_weather(route)

        return jsonify(departments_weather=departments_weather), HTTPStatus.OK

    except ValueError as e:
        return jsonify(message=str(e)), HTTPStatus.BAD_REQUEST

    except Exception as e:
        return jsonify(message=str(e)), HTTPStatus.INTERNAL_SERVER_ERROR


@route_api.route('/itineraire/departments-accidents')
def get_departments_accidents():
    try:
        start_address = request.args.get('start_address')
        end_address = request.args.get('end_address')

        route = route_service.get_route(start_address, end_address)

        departments_accidents = route_service.get_accidents_in_departments(
            route)

        return jsonify(departments_accidents=departments_accidents), HTTPStatus.OK

    except ValueError as e:
        return jsonify(message=str(e)), HTTPStatus.BAD_REQUEST

    except Exception as e:
        return jsonify(message=str(e)), HTTPStatus.INTERNAL_SERVER_ERROR
