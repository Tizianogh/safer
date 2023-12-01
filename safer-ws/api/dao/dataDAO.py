import geopandas as gpd


class DataDAO:
    @staticmethod
    def load_geojson(file_path: str) -> gpd.GeoDataFrame:
        data = gpd.read_file(file_path)
        return data
