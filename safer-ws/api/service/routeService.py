import openrouteservice
from api.dao.accidentDAO import AccidentDAO
from api.service.accidentService import AccidentService
from shapely.geometry import Point
from collections import Counter
from api.dao.dataDAO import DataDAO
from os import path
import requests
import json


class RouteService:
    def __init__(self, api_key):
        self.client = openrouteservice.Client(key=api_key)
        self.accident_service = AccidentService(AccidentDAO())
        self.departments_gdf = None

    def get_coordinates_from_address(self, address):
        geocode_result = self.client.pelias_search(text=address)
        coordinates = geocode_result['features'][0]['geometry']['coordinates']
        return coordinates

    def get_route(self, start_address, end_address, profile='driving-car'):
        start_coordinates = self.get_coordinates_from_address(start_address)
        end_coordinates = self.get_coordinates_from_address(end_address)
        coordinates = [start_coordinates, end_coordinates]

        route_params = {
            'coordinates': coordinates,
            'profile': profile,
            'format_out': 'geojson',
            'instructions': 'false'
        }

        route_result = self.client.directions(**route_params)
        return route_result

    def load_departments_geojson(self, file_path):
        self.departments_gdf = DataDAO.load_geojson(file_path)

    def is_point_in_department(self, point, department):
        return Point(point).within(department.geometry)

    def get_departments_crossed(self, route):
        basedir = path.abspath(path.join(path.dirname(__file__), '../..'))
        geojson_path = path.join(basedir, 'assets', 'departements.geojson')
        self.load_departments_geojson(geojson_path)

        crossed_departments = set()

        for feature in route['features']:
            if feature['geometry']['type'] == 'LineString':
                for coordinates in feature['geometry']['coordinates']:
                    point = Point(coordinates)
                    for _, department in self.departments_gdf.iterrows():
                        if point.within(department.geometry):
                            crossed_departments.add(department['code'])

        return list(crossed_departments)

    def get_departement_coordinates(self, departement_code):
        if self.departments_gdf is None:
            raise ValueError(
                "Departments data not loaded. Call load_departments_geojson first.")

        departement_data = self.departments_gdf[self.departments_gdf['code']
                                                == departement_code]

        departement_data = departement_data.to_crs("EPSG:2154")

        centroid = departement_data.geometry.centroid
        centroid = centroid.to_crs("EPSG:4326")

        latitude = centroid.y.values[0]
        longitude = centroid.x.values[0]

        return latitude, longitude

    def get_departments_crossed_coordinates(self, route):
        crossed_departments = self.get_departments_crossed(route)

        crossed_departments_coordinates = {
            dep: self.get_departement_coordinates(dep) for dep in crossed_departments
        }

        return crossed_departments_coordinates

    def map_weather_to_atm(self, weather_code):
        if weather_code == 0:
            return 1  # Normale
        elif weather_code in [1, 2, 3]:
            return 1  # Normale (Considéré comme principalement dégagé)
        elif weather_code in [45, 48]:
            return 5  # Brouillard - fumée
        elif weather_code in [51, 53]:
            return 2  # Pluie légère
        elif weather_code in [55]:
            return 3  # Pluie forte
        elif weather_code in [61, 63, 65]:
            return 3  # Pluie forte
        elif weather_code in [66, 67]:
            return 3  # Pluie forte
        elif weather_code in [71, 73, 75]:
            return 4  # Neige - grêle
        elif weather_code in [77]:
            return 5  # Brouillard - fumée
        elif weather_code in [80, 81, 82]:
            return 2  # Pluie légère
        elif weather_code in [85, 86]:
            return 4  # Neige - grêle
        elif weather_code in [95]:
            return 6  # Vent fort - tempête
        elif weather_code in [96, 99]:
            return 4  # Neige - grêle
        else:
            return -1  # Non renseigné

    def map_average_score_to_atm(self, average_score):
        if average_score <= 1:  # Normale
            return 1
        elif average_score <= 1.5:  # Temps couvert
            return 8
        elif average_score <= 2.5:  # Pluie légère
            return 2
        elif average_score <= 3.5:  # Pluie forte
            return 3
        elif average_score <= 4.5:  # Neige - grêle
            return 4
        else:  # Vent fort - tempête
            return 6

    def map_daytime_to_lum(self, is_day):
        if is_day == 1:
            return 1  # Plein jour
        else:
            return 5  # Nuit avec éclairage public allumé

    def get_common_daytime(self, route):
        _, departments_daytime = self.get_departments_weather(route)
        common_daytime = Counter(
            departments_daytime.values()).most_common(1)[0][0]
        return common_daytime

    def get_weather_and_daytime(self, latitude, longitude):
        url = f"https://api.open-meteo.com/v1/forecast?latitude={latitude}&longitude={longitude}&current_weather=true"
        response = requests.get(url)
        data = json.loads(response.text)
        weather_code = data['current_weather']['weathercode']
        is_day = data['current_weather']['is_day']
        print("Weather Code:", weather_code)
        print("Is Day:", is_day)
        return weather_code, is_day

    def get_departments_weather(self, route):
        crossed_departments_coordinates = self.get_departments_crossed_coordinates(
            route)
        departments_weather = {}
        departments_lum = {}

        for department, coordinates in crossed_departments_coordinates.items():
            latitude, longitude = coordinates
            weather_code, is_day = self.get_weather_and_daytime(
                latitude, longitude)
            departments_weather[department] = self.map_weather_to_atm(
                weather_code)
            departments_lum[department] = self.map_daytime_to_lum(is_day)

        print("Departments Weather:", departments_weather)
        print("Departments Lum:", departments_lum)

        average_weather = self.map_average_score_to_atm(
            sum(departments_weather.values()) / len(departments_weather))

        common_daytime = Counter(departments_lum.values()).most_common(1)[0][0]

        print("Average Weather:", average_weather)
        print("Common Daytime:", common_daytime)

        return average_weather, common_daytime

    def get_accidents_in_departments(self, route):
        crossed_departments = self.get_departments_crossed(route)
        departments_accidents = {}

        for department in crossed_departments:
            department_int = int(department)
            accidents = self.accident_service.getAccidentDataByDepartment(
                'dep', department_int)
            departments_accidents[department_int] = accidents

        return departments_accidents
