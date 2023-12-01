import numpy as np
import pandas as pd
from datetime import datetime

from api.service.routeService import RouteService
from api.dao.profilDAO import ProfilDAO
from api.service.profilService import ProfilService


class RisqueService:
    def __init__(self, api_key):
        self.route_service = RouteService(api_key)
        self.profil_service = ProfilService()
        self.variables = ['sexe', 'trajet',
                          'tranche_age', 'catv', 'atm', 'lum']
        self.weights = {
            'sexe': 0.3,
            'trajet': 0.2,
            'tranche_age': 0.2,
            'catv': 0.2,
            'atm': 0.3,
            'lum': 0.1
        }

    def sigmoid(self, x):
        return 1 / (1 + np.exp(-x))

    def calculate_risk_score(self, route, profile):
        dep = self.route_service.get_departments_crossed(route)

        accidents_in_departments = self.route_service.get_accidents_in_departments(
            route)

        all_percentages = pd.DataFrame()
        for department, accidents in accidents_in_departments.items():
            accidents_df = pd.DataFrame(accidents)
            department_percentages = pd.DataFrame()
            for var in profile.keys():
                var_percentages = accidents_df[var].value_counts(
                    normalize=True).mul(100).reset_index(name=f'percentage_{var}')
                var_percentages.rename(columns={'index': var}, inplace=True)

                var_percentages['department'] = department
                if department_percentages.empty:
                    department_percentages = var_percentages
                else:
                    department_percentages = pd.merge(
                        department_percentages, var_percentages, on=['department'])

            department_percentages_max = department_percentages.loc[department_percentages.groupby(
                'department')[[f'percentage_{var}' for var in profile.keys()]].idxmax().values.ravel()]

            if all_percentages.empty:
                all_percentages = department_percentages_max
            else:
                all_percentages = pd.concat(
                    [all_percentages, department_percentages_max])

        all_percentages['risk_score'] = 0
        for var, weight in self.weights.items():
            all_percentages['risk_score'] += all_percentages[f'percentage_{var}'] * weight * (
                all_percentages[var] == profile[var])

        all_percentages['risk_score'] = (
            all_percentages['risk_score'] - all_percentages['risk_score'].mean()) / all_percentages['risk_score'].std()
        all_percentages['risk_score'] = self.sigmoid(
            all_percentages['risk_score'])
        all_percentages['risk_score'] = all_percentages['risk_score'] * 100

        return all_percentages.drop_duplicates(), route, dep
