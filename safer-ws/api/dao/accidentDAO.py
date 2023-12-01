from pymongo import MongoClient
from config import MONGODB_URI


class AccidentDAO:
    def __init__(self):
        self.client = MongoClient(MONGODB_URI)
        self.db = self.client['safer']
        self.collection = self.db['accidents']

    def getAllAccidents(self):
        data = self.collection.find().limit(10)
        return data

    def getAccidentsByCondition(self, fieldName, fieldValue):
        data = self.collection.find({fieldName: fieldValue})
        return data

    def countAccidentsByCondition(self, fieldName, fieldValue):
        count = self.collection.count_documents({fieldName: fieldValue})
        return count

    def countAccidentsByYearRange(self, start_year, end_year):
        year_count_map = {}
        for year in range(start_year, end_year + 1):
            count = self.collection.count_documents({"Year": year})
            year_count_map[str(year)] = count
        return year_count_map

    def countAccidentsByYearRangeAndDepartment(self, start_year, end_year, department):
        year_count_map = {}
        for year in range(start_year, end_year + 1):
            count = self.collection.count_documents(
                {"Year": year, "dep": department})
            year_count_map[str(year)] = count
        return year_count_map

    def getAccidentsByCriteria(self, criteria):
        for key in criteria.keys():
            if key not in self.collection.find_one().keys():
                raise ValueError(
                    "La colonne {} n'existe pas dans la collection".format(key))

        result = self.collection.find(criteria)
        count = self.collection.count_documents(criteria)

        return count

    def countAccidentsByUniqueValues(self, fieldName):
        if fieldName not in self.collection.find_one().keys():
            raise ValueError(
                "La colonne {} n'existe pas dans la collection".format(fieldName))

        pipeline = [
            {
                "$group": {
                    "_id": f"${fieldName}",
                    "count": {"$sum": 1}
                }
            },
            {
                "$sort": {
                    "count": -1
                }
            }
        ]

        result = self.collection.aggregate(pipeline)

        result_dict = {str(item["_id"]): item["count"] for item in result}

        return result_dict

    def countAccidentsByUniqueValuesAndCondition(self, fieldName, newFieldName, fieldValue):
        if fieldName not in self.collection.find_one().keys() or newFieldName not in self.collection.find_one().keys():
            raise ValueError("La colonne {} ou {} n'existe pas dans la collection".format(
                fieldName, newFieldName))

        pipeline = [
            {
                "$match": {
                    newFieldName: fieldValue
                }
            },
            {
                "$group": {
                    "_id": f"${fieldName}",
                    "count": {"$sum": 1}
                }
            },
            {
                "$sort": {
                    "count": -1
                }
            }
        ]

        result = self.collection.aggregate(pipeline)

        result_dict = {str(item["_id"]): item["count"] for item in result}

        return result_dict
