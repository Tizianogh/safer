import openrouteservice
import geopandas as gpd
import pandas as pd
from mlxtend.preprocessing import TransactionEncoder
from mlxtend.frequent_patterns import apriori, association_rules

api_key = "5b3ce3597851110001cf62480360bffa7e0a43c99916c4cb6e9361d0"

# Chargez vos données dans un DataFrame Pandas
data = pd.read_csv("merged.csv")
data['dep'] = data['dep'].astype(str)


# Remplacez les virgules par des points dans les colonnes 18 et 19 (lat et longi)
data['lat'] = data['lat'].replace(',', '.', regex=True)
data['longi'] = data['longi'].replace(',', '.', regex=True)

# Convertissez les colonnes en type numérique (float)
data['lat'] = pd.to_numeric(data['lat'], errors='coerce')
data['longi'] = pd.to_numeric(data['longi'], errors='coerce')


def get_route(point_A, point_B):
    client = openrouteservice.Client(key=api_key)
    route = client.directions(
        coordinates=[point_A, point_B],
        profile="driving-car",
        format="geojson",
    )
    itineraire_gpd = gpd.GeoDataFrame.from_features(
        route["features"], crs="EPSG:4326")

    return itineraire_gpd


def get_departements_traverses(itineraire_gpd, departements):
    departements_traverses = gpd.overlay(
        departements, itineraire_gpd, how="intersection", keep_geom_type=False)
    departements_traverses['code'] = departements_traverses['code'].astype(str)
    return departements_traverses


def departements_traverses_par_itineraire(point_A, point_B):
    itineraire_gpd = get_route(point_A, point_B)
    departements = gpd.read_file("departements.geojson")
    departements_traverses = get_departements_traverses(
        itineraire_gpd, departements)
    return departements_traverses


point_A = (2.3522219, 48.856614)  # Paris
point_B = (1.489012, 48.443854)  # Chartes

resultat = departements_traverses_par_itineraire(point_A, point_B)

# Filtrer les données pour inclure uniquement les accidents survenus dans les départements traversés par l'itinéraire
codes_departements_traverses = resultat['code'].tolist()
data = data[data['dep'].isin(codes_departements_traverses)]


print(codes_departements_traverses)
print(data)

colonnes_pertinentes = ['dep', 'grav', 'catv',
                        'atm', 'lum', 'int', 'col', 'circ']
data = data[colonnes_pertinentes]

transactions = []
for index, row in data.iterrows():
    transaction = []
    for col in colonnes_pertinentes:
        transaction.append(f"{col}={row[col]}")
    transactions.append(transaction)


encoder = TransactionEncoder()
transactions_encoded = encoder.fit(transactions).transform(transactions)
transactions_df = pd.DataFrame(transactions_encoded, columns=encoder.columns_)

support_min = 0.01  # Ajustez cette valeur en fonction de vos besoins
ensembles_frequents = apriori(
    transactions_df, min_support=support_min, use_colnames=True)

confiance_min = 0.6  # Ajustez cette valeur en fonction de vos besoins
regles = association_rules(
    ensembles_frequents, metric='confidence', min_threshold=confiance_min)

regles = regles.sort_values(by='confidence', ascending=False)

print(regles)

# Ouvrez un fichier texte pour stocker les résultats
with open("rapport.txt", "w") as fichier_rapport:
    # Écrivez les départements traversés dans le fichier
    fichier_rapport.write("Départements traversés:\n")
    fichier_rapport.write(resultat.to_string())
    fichier_rapport.write("\n\n")

    # Écrivez les données filtrées dans le fichier
    fichier_rapport.write("Données filtrées:\n")
    fichier_rapport.write(data.to_string())
    fichier_rapport.write("\n\n")

# Exportez les règles d'association dans un fichier CSV
regles.to_csv("regles_association.csv", index=False)
