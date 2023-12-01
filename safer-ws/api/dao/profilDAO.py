from pymongo import MongoClient
from config import MONGODB_URI


class ProfilDAO:
    def __init__(self):
        self.client = MongoClient(MONGODB_URI)
        self.db = self.client['safer']
        self.collection = self.db['accidents']

    def get_values_profil(self, column_name):
        return self.collection.distinct(column_name)
