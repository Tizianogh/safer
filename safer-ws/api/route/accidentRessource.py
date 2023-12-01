from http import HTTPStatus
from flask import Blueprint, jsonify, request
from flasgger import swag_from
from ..service.accidentService import AccidentService
from ..dao.accidentDAO import AccidentDAO
from ..model.accident import AccidentSchema

accident_api = Blueprint('accident', __name__)

accident_dao = AccidentDAO()
accident_service = AccidentService(accident_dao)


@accident_api.route('/')
@swag_from({
    'responses': {
        HTTPStatus.OK.value: {
            'description': 'Get all accident data',
            'schema': AccidentSchema
        }
    }
})
def getaccidentData():
    data = accident_service.getAllAccidents()
    return jsonify(data), 200


@accident_api.route('/department/<int:department>')
@swag_from({
    'parameters': [
        {
            'name': 'department',
            'in': 'path',
            'type': 'integer',
            'required': True,
            'description': 'The department number.',
            'example': 75
        }
    ],
    'responses': {
        HTTPStatus.OK.value: {
            'description': 'Get accident data by department',
            'schema': AccidentSchema
        }
    }
})
def getaccidentDataByDepartment(department):
    data = accident_service.getAccidentDataByDepartment("dep", department)
    return jsonify(data), 200


@accident_api.route('/count/department/<int:department>')
@swag_from({
    'parameters': [
        {
            'name': 'department',
            'in': 'path',
            'type': 'integer',
            'required': True,
            'description': 'The department number.',
            'example': 75
        }
    ],
    'responses': {
        HTTPStatus.OK.value: {
            'description': 'Get accident count by department',
            'schema': {
                'type': 'integer',
                'example': 42,
            }
        }
    }
})
def countAccidentsByDepartment(department):
    count = accident_service.countAccidentsByCondition("dep", department)
    return jsonify(count), 200


@accident_api.route('/count/year-range/<int:start_year>/<int:end_year>')
@swag_from({
    'parameters': [
        {
            'name': 'start_year',
            'in': 'path',
            'type': 'integer',
            'required': True,
            'description': 'The start year of the range.',
            'example': 2017
        },
        {
            'name': 'end_year',
            'in': 'path',
            'type': 'integer',
            'required': True,
            'description': 'The end year of the range.',
            'example': 2021
        }
    ],
    'responses': {
        HTTPStatus.OK.value: {
            'description': 'Get accident count by year range',
            'schema': {
                'type': 'object',
                'properties': {
                    '2017': {'type': 'integer', 'example': 42},
                    '2018': {'type': 'integer', 'example': 35},
                    '2019': {'type': 'integer', 'example': 50},
                    '2020': {'type': 'integer', 'example': 48},
                    '2021': {'type': 'integer', 'example': 53},
                }
            }
        }
    }
})
def countAccidentsByYearRange(start_year, end_year):
    year_count_map = accident_service.countAccidentsByYearRange(
        start_year, end_year)
    return jsonify(year_count_map), 200


@accident_api.route('/count/year-range/<int:start_year>/<int:end_year>/department/<int:department>')
@swag_from({
    'parameters': [
        {
            'name': 'start_year',
            'in': 'path',
            'type': 'integer',
            'required': True,
            'description': 'The start year of the range.',
            'example': 2017
        },
        {
            'name': 'end_year',
            'in': 'path',
            'type': 'integer',
            'required': True,
            'description': 'The end year of the range.',
            'example': 2021
        },
        {
            'name': 'department',
            'in': 'path',
            'type': 'integer',
            'required': True,
            'description': 'The department number.',
            'example': 75
        }
    ],
    'responses': {
        HTTPStatus.OK.value: {
            'description': 'Get accident count by year range and department',
            'schema': {
                'type': 'object',
                'properties': {
                    '2017': {'type': 'integer', 'example': 42},
                    '2018': {'type': 'integer', 'example': 35},
                    '2019': {'type': 'integer', 'example': 50},
                    '2020': {'type': 'integer', 'example': 48},
                    '2021': {'type': 'integer', 'example': 53},
                }
            }
        }
    }
})
def countAccidentsByYearRangeAndDepartment(start_year, end_year, department):
    year_count_map = accident_service.countAccidentsByYearRangeAndDepartment(
        start_year, end_year, department)
    return jsonify(year_count_map), 200


@accident_api.route('/criteria')
@swag_from({
    'parameters': [
        {
            'name': 'criteria',
            'in': 'query',
            'type': 'integer',
            'required': False,
            'description': 'A key-value pair of criteria in the query string.',
            'example': 'dep=75'
        }
    ],
    'responses': {
        HTTPStatus.OK.value: {
            'description': 'Get accident data by criteria',
            'schema': AccidentSchema
        }
    }
})
def getAccidentByDataCriteria():
    criteria = {}
    for key, value in request.args.items():
        criteria[key] = int(value)
    data = accident_service.getAccidentsByCriteria(criteria)
    return jsonify(data), 200


@accident_api.route('/count/unique-values/<string:field_name>')
@swag_from({
    'parameters': [
        {
            'name': 'field_name',
            'in': 'path',
            'type': 'string',
            'required': True,
            'description': 'The field name for which to count accidents by unique values.',
            'example': 'grav'
        }
    ],
    'responses': {
        HTTPStatus.OK.value: {
            'description': 'Get accident count by unique values of a field',
            'schema': {
                'type': 'object',
                'properties': {
                    '1': {'type': 'integer', 'example': 1200},
                    '2': {'type': 'integer', 'example': 2500},
                    '3': {'type': 'integer', 'example': 1800},
                    '4': {'type': 'integer', 'example': 600},
                }
            }
        }
    }
})
def countAccidentsByUniqueValues(field_name):
    unique_value_count = accident_service.countAccidentsByUniqueValues(
        field_name)
    return jsonify(unique_value_count), 200


@accident_api.route('/count/unique-values/<string:field_name>/<string:new_field_name>/<int:field_value>')
@swag_from({
    'parameters': [
        {
            'name': 'field_name',
            'in': 'path',
            'type': 'string',
            'required': True,
            'description': 'The field name for which to count accidents by unique values.',
            'example': 'grav'
        },
        {
            'name': 'new_field_name',
            'in': 'path',
            'type': 'string',
            'required': True,
            'description': 'The new field name to use for condition.',
            'example': 'dep'
        },
        {
            'name': 'field_value',
            'in': 'path',
            'type': 'string',
            'required': True,
            'description': 'The field value to use for condition.',
            'example': '75'
        }
    ],
    'responses': {
        HTTPStatus.OK.value: {
            'description': 'Get accident count by unique values of a field',
            'schema': {
                'type': 'object',
                'properties': {
                    '1': {'type': 'integer', 'example': 1200},
                    '2': {'type': 'integer', 'example': 2500},
                    '3': {'type': 'integer', 'example': 1800},
                    '4': {'type': 'integer', 'example': 600},
                }
            }
        }
    }
})
def countAccidentsByUniqueValuesAndCondition(field_name, new_field_name, field_value):
    unique_value_count = accident_service.countAccidentsByUniqueValuesAndCondition(
        field_name, new_field_name, field_value)
    return jsonify(unique_value_count), 200
