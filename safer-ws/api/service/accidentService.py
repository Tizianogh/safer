from ..dao.accidentDAO import AccidentDAO
from ..model.accident import AccidentSchema


class AccidentService:
    def __init__(self, accidentDAO):
        self.accidentDAO = AccidentDAO()
        self.accident_schema = AccidentSchema(many=True)

    def getAllAccidents(self):
        data = self.accidentDAO.getAllAccidents()
        return self.accident_schema.dump(data)

    def getAccidentDataByDepartment(self, fieldName, fieldValue):
        data = self.accidentDAO.getAccidentsByCondition(fieldName, fieldValue)
        return self.accident_schema.dump(data)

    def countAccidentsByCondition(self, fieldName, fieldValue):
        count = self.accidentDAO.countAccidentsByCondition(
            fieldName, fieldValue)
        return count

    def countAccidentsByYearRange(self, start_year, end_year):
        year_count_map = self.accidentDAO.countAccidentsByYearRange(
            start_year, end_year)
        return year_count_map

    def countAccidentsByYearRangeAndDepartment(self, start_year, end_year, department):
        year_count_map = self.accidentDAO.countAccidentsByYearRangeAndDepartment(
            start_year, end_year, department)
        return year_count_map

    def getAccidentsByCriteria(self, criteria):
        data = self.accidentDAO.getAccidentsByCritriaDAO(criteria)
        return data

    def countAccidentsByUniqueValues(self, fieldName):
        count = self.accidentDAO.countAccidentsByUniqueValues(fieldName)
        return count

    def countAccidentsByUniqueValuesAndCondition(self, fieldName, newFieldName, fieldValue):
        count = self.accidentDAO.countAccidentsByUniqueValuesAndCondition(
            fieldName, newFieldName, fieldValue)
        return count
