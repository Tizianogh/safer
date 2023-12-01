import csv
import numpy as np

# Fonction pour remplacer -1 par 1 ou 2 de manière aléatoire


def replace_minus_one(value):
    if value == '-1':
        return str(np.random.choice(['1', '2']))
    else:
        return value


# Ouvrir le fichier CSV en lecture
with open('merged.csv', 'r') as csvfile:
    reader = csv.DictReader(csvfile)
    rows = list(reader)

filtered_rows = []
lignes_supprimees = 0
for row in rows:
    if row['grav'] != '-1':
        filtered_rows.append(row)
    else:
        lignes_supprimees += 1

for row in filtered_rows:
    row['longi'] = row['longi'].replace(',', '.')
    row['lat'] = row['lat'].replace(',', '.')
    row['sexe'] = replace_minus_one(row['sexe'])

    if ',' in row['longi'] or ',' in row['lat']:
        print("Il y a encore des virgules dans les colonnes 'longi' et 'lat'.")
    else:
        print("Plus de virgule")

    an_nais = int(row['an_nais'])
    age = 2023 - an_nais

    if age < 15:
        row['tranche_age'] = '<15'
    elif 15 <= age <= 19:
        row['tranche_age'] = '15-19'
    elif 20 <= age <= 24:
        row['tranche_age'] = '20-24'
    elif 25 <= age <= 29:
        row['tranche_age'] = '25-29'
    elif 30 <= age <= 34:
        row['tranche_age'] = '30-34'
    elif 35 <= age <= 39:
        row['tranche_age'] = '35-39'
    elif 40 <= age <= 44:
        row['tranche_age'] = '40-44'
    elif 45 <= age <= 49:
        row['tranche_age'] = '45-49'
    elif 50 <= age <= 54:
        row['tranche_age'] = '50-54'
    elif 55 <= age <= 59:
        row['tranche_age'] = '55-59'
    elif 60 <= age <= 64:
        row['tranche_age'] = '60-64'
    elif 65 <= age <= 69:
        row['tranche_age'] = '65-69'
    elif 70 <= age <= 74:
        row['tranche_age'] = '70-74'
    else:
        row['tranche_age'] = '>75'


for row in filtered_rows:
    if row['trajet'] == '0' or row['trajet'] == '0.0':
        row['trajet'] = '-1'
    elif row['trajet'] != '-1':
        row['trajet'] = str(int(float(row['trajet'])))

unique_values_trajet = set(row['trajet']
                           for row in filtered_rows if row['trajet'] != '-1')
unique_values_trajet = list(unique_values_trajet)

for row in filtered_rows:
    if row['trajet'] == '-1':
        row['trajet'] = np.random.choice(unique_values_trajet)
    row['atm'] = int(float(row['atm']))

# Trouver les valeurs uniques dans la colonne 'atm' qui ne sont pas égales à -1
unique_values_atm = set(row['atm']
                        for row in filtered_rows if row['atm'] != -1)
unique_values_atm = list(unique_values_atm)

# Remplacer les -1 dans la colonne 'atm' par une valeur aléatoire unique
for row in filtered_rows:
    if row['atm'] == -1:
        row['atm'] = np.random.choice(unique_values_atm)

filtered_rows = []
lignes_supprimees = 0
for row in rows:
    if row['grav'] != '-1':
        filtered_rows.append(row)
    else:
        lignes_supprimees += 1

unique_values = set(row['catv']
                    for row in filtered_rows if row['catv'] not in ['0', '99'])

unique_values = list(unique_values)

for row in filtered_rows:
    if row['catv'] in ['0', '99']:
        row['catv'] = np.random.choice(unique_values)

unique_values_trajet = set(int(float(row['trajet']))
                           for row in filtered_rows if row['trajet'] != '-1')

unique_values_trajet = list(unique_values_trajet)

for row in filtered_rows:
    if row['trajet'] == '-1':
        row['trajet'] = str(np.random.choice(unique_values_trajet))

count_0 = sum(1 for row in filtered_rows if row['catv'] == '0')
count_99 = sum(1 for row in filtered_rows if row['catv'] == '99')
count_1 = sum(1 for row in filtered_rows if row['trajet'] == '-1')

print("Nombre de '0' dans la colonne 'catv' :", count_0)
print("Nombre de '99' dans la colonne 'catv' :", count_99)
print("Nombre de '-1' dans la colonne 'trajet :", count_1)


# Trouver les valeurs uniques dans la colonne 'lum' qui ne sont pas égales à -1
unique_values_lum = set(row['lum']
                        for row in filtered_rows if row['lum'] != '-1')
unique_values_lum = list(unique_values_lum)

# Remplacer les -1 dans la colonne 'lum' par une valeur aléatoire unique
for row in filtered_rows:
    if row['lum'] == '-1':
        row['lum'] = np.random.choice(unique_values_lum)

minus_one_count_lum = sum(1 for row in filtered_rows if row['lum'] == '-1')
print("Nombre de -1 restant dans la colonne 'lum' :", minus_one_count_lum)


with open('nouveau_fichier.csv', 'w', newline='') as csvfile:
    fieldnames = reader.fieldnames + ['tranche_age']
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(filtered_rows)

print("Nombre de lignes supprimées :", lignes_supprimees)

changements_trajet = 0
for row in filtered_rows:
    if row['trajet'] == '-1':
        changements_trajet += 1

print("Nombre de changements dans la colonne 'trajet' :", changements_trajet)

minus_one_count = sum(1 for row in filtered_rows if row['sexe'] == '-1')
print("Nombre de -1 restant dans la colonne 'sexe' :", minus_one_count)
