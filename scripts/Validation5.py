from sklearn.metrics import classification_report
from sklearn.model_selection import cross_val_predict, cross_val_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.neighbors import KNeighborsClassifier
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import OneHotEncoder
import matplotlib.pyplot as plt

# Initialiser les modèles
models = {
    'Logistic Regression': LogisticRegression(max_iter=10000),
    'Random Forest': RandomForestClassifier(),
    'KNN': KNeighborsClassifier(),
}

# Charger les données
data = pd.read_csv("/content/drive/MyDrive/Data/merged.csv")

# Liste des colonnes catégorielles à encoder
categorical_columns = ['sexe', 'tranche_age', 'trajet', 'lum', 'atm', 'catv']

# Créer un encodeur
encoder = OneHotEncoder(drop='first')

# Fit the encoder on all data
data_to_encode = data[categorical_columns].fillna(data.mode().iloc[0])
encoder.fit(data_to_encode)

departments = data['dep'].unique()

# Initialiser un dataframe pour stocker les résultats
results = pd.DataFrame(columns=['Department', 'Model', 'Accuracy', 'Weighted Avg Recall', 'Weighted Avg F1-Score', 'Cross Val Score'])

for dep in departments:
    dep_data = data[data['dep'] == dep]

    # Supprimer les lignes pour lesquelles 'grav' est égal à -1
    dep_data = dep_data[dep_data['grav'] != -1]
    dep_data = dep_data.reset_index(drop=True)

    # Supprimer les autres colonnes
    dep_data = dep_data.drop(['an_nais', 'jour', 'lat', 'longi', 'num_veh', 'senc', 'obs', 'choc', 'agg', 'int', 'obsm', 'vosp', 'Year', 'circ', 'catr', 'col', 'prof', 'plan', 'surf', 'infra', 'dep', 'situ', 'Num_Acc', 'mois'], axis=1)

    # Remplacer les valeurs nulles dans les colonnes catégorielles par la valeur la plus fréquente
    for column in dep_data.columns:
        if dep_data[column].dtype == 'object':
            dep_data[column].fillna(dep_data[column].mode()[0], inplace=True)
        else:
            dep_data[column].fillna(dep_data[column].mean(), inplace=True)

    # Appliquer le one-hot encoding en utilisant l'encodeur
    df_encoded = encoder.transform(dep_data[categorical_columns])

    # Convertir le tableau sparse en DataFrame
    df_encoded = pd.DataFrame(df_encoded.toarray(), columns=encoder.get_feature_names_out(input_features=categorical_columns))

    df_other_columns = dep_data.drop(columns=categorical_columns+['grav'])
    df_encoded = pd.concat([df_encoded, df_other_columns], axis=1)

    # définir y
    y = dep_data['grav'] 

    # définir X
    X = df_encoded

    # Diviser les données en ensemble d'entraînement et ensemble de test
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    for model_name, model in models.items():
        model.fit(X_train, y_train)
        y_pred = cross_val_predict(model, X, y, cv=5)  # obtenir les prédictions à l'aide de la validation croisée
        report = classification_report(y, y_pred, output_dict=True)

        accuracy = report['accuracy']
        weighted_avg_recall = report['weighted avg']['recall']
        weighted_avg_f1_score = report['weighted avg']['f1-score']

        # Ajouter le score de validation croisée
        cross_val_scores = cross_val_score(model, X, y, cv=5)
        cross_val_score_mean = np.mean(cross_val_scores)

        # Ajouter les résultats à notre DataFrame
        results = results.append({
            'Department': dep,
            'Model': model_name,
            'Accuracy': accuracy,
            'Weighted Avg Recall': weighted_avg_recall,
            'Weighted Avg F1-Score': weighted_avg_f1_score,
            'Cross Val Score': cross_val_score_mean
        }, ignore_index=True)

# Calculer les moyennes pour chaque modèle
average_results = results.groupby('Model').mean().reset_index()

# Créer le graphique à barres empilées
bar_width = 0.25
index = np.arange(len(average_results))

plt.bar(index, average_results['Accuracy'], bar_width, label='Accuracy')
plt.bar(index + bar_width, average_results['Weighted Avg Recall'], bar_width, label='Weighted Avg Recall')
plt.bar(index + 2*bar_width, average_results['Weighted Avg F1-Score'], bar_width, label='Weighted Avg F1-Score')
plt.bar(index + 3*bar_width, average_results['Cross Val Score'], bar_width, label='Cross Val Score')

plt.xlabel('Model')
plt.ylabel('Average Score')
plt.title('Average Performance Metrics by Model')
plt.xticks(index + bar_width, average_results['Model'])
plt.legend()

plt.tight_layout()
plt.show()

print(average_results)