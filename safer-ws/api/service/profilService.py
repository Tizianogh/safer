from ..dao.profilDAO import ProfilDAO


class ProfilService:
    def __init__(self):
        self.profilDAO = ProfilDAO()

    def get_values_profil(self, column_name):
        return self.profilDAO.get_values_profil(column_name)

    def get_age_category(self, age):
        age_ranges = self.get_values_profil('tranche_age')

        for age_range in age_ranges:
            age_range = age_range.strip()

            if age_range == '<15':
                if age < 15:
                    return age_range
            elif age_range == '>75':
                if age > 75:
                    return age_range
            else:
                age_min, age_max = map(int, age_range.split('-'))
                if age_min <= age <= age_max:
                    return age_range

        return 'unknown'

    def create_user_profile(self, sexe, age, trajet, lum, atm, catv):
        user_profile = {
            'sexe': sexe,
            'tranche_age': self.get_age_category(age),
            'trajet': trajet,
            'lum': lum,
            'atm': atm,
            'catv': catv
        }
        return user_profile
