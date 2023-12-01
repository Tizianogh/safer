from http import HTTPStatus
from flask import Blueprint, jsonify
from flasgger import swag_from
from ..service.profilService import ProfilService
from ..dao.profilDAO import ProfilDAO

profil_api = Blueprint('profil', __name__)

profil_service = ProfilService()


@profil_api.route('/unique-values/<string:column_name>')
@swag_from({
    'parameters': [
        {
            'name': 'column_name',
            'in': 'path',
            'type': 'string',
            'required': True,
            'description': 'The column name for which to get unique values.',
            'example': 'trajet'
        }
    ],
    'responses': {
        HTTPStatus.OK.value: {
            'description': 'Get unique values of a column',
            'schema': {
                'type': 'array',
                'items': {'type': 'string'},
            }
        }
    }
})
def get_unique_values(column_name):
    unique_values = profil_service.get_values_profil(column_name)
    return jsonify(unique_values), 200


@profil_api.route('/create-profile/<int:age>/<int:sexe>/<int:trajet>')
@swag_from({
    'parameters': [
        {
            'name': 'age',
            'in': 'path',
            'type': 'integer',
            'required': True,
            'description': 'User age.',
        },
        {
            'name': 'sexe',
            'in': 'path',
            'type': 'integer',
            'required': True,
            'description': 'User sexe, valid values are 1, 2.',
        },
        {
            'name': 'trajet',
            'in': 'path',
            'type': 'integer',
            'required': True,
            'description': 'User trajet, valid values are -1,0, 1, 2, 3, 4, 5, 6, 7, 8, 9.',
        }
    ],
    'responses': {
        HTTPStatus.OK.value: {
            'description': 'Create a user profile',
            'schema': {
                'type': 'object',
                'properties': {
                    'age': {'type': 'integer'},
                    'sexe': {'type': 'integer'},
                    'trajet': {'type': 'integer'},
                },
            }
        }
    }
})
def create_profile(age, sexe, trajet):
    user_profile = profil_service.create_user_profile(age, sexe, trajet)
    return jsonify(user_profile), 200
