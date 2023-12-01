# Importer les librairies
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import accuracy_score, confusion_matrix, f1_score, precision_score, recall_score, classification_report
from sklearn.model_selection import cross_val_score, train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
import pandas as pd
from sklearn.neighbors import KNeighborsClassifier
from sklearn.linear_model import LogisticRegression


data = pd.read_csv("/content/drive/MyDrive/Data/merged.csv")

# Supprimer la colonne 'an_nais'
df = data[data['grav'] != -1]
# Supprimer les autres colonnes
df = df.drop(['an_nais', 'jour', 'lat', 'longi', 'num_veh', 'senc', 'obs', 'choc', 'agg', 'int', 'obsm', 'vosp', 'Year', 'circ', 'catr', 'col', 'prof', 'plan', 'surf', 'infra', 'dep', 'situ', 'Num_Acc', 'mois'], axis=1)

# Liste des colonnes catégorielles à encoder
categorical_columns = ['sexe', 'trajet', 'tranche_age', 'atm', 'lum', 'catv']

# Appliquer le one-hot encoding
df_encoded = pd.get_dummies(df, columns=categorical_columns, drop_first=True)

# Séparer les variables indépendantes (X) des variables dépendantes (y)
X = df_encoded.drop('grav', axis=1)
y = df_encoded['grav']

# Diviser les données en ensemble d'entraînement et ensemble de test
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Initialiser le modèle
logreg = LogisticRegression(C=1, class_weight=None, max_iter=10000, penalty='l2', solver='lbfgs', n_jobs=-1)

# Entraîner, tester et calculer les scores
cross_val_scores = cross_val_score(logreg, X, y, cv=5).mean()
logreg.fit(X_train, y_train)
y_pred = logreg.predict(X_test)
accuracy_score = accuracy_score(y_test, y_pred)
f1_score = f1_score(y_test, y_pred, average='weighted')
precision_score = precision_score(y_test, y_pred, average='weighted')
recall_score = recall_score(y_test, y_pred, average='weighted')

# Afficher les scores
print(f"logreg Accuracy: {accuracy_score}\n")
print(f"logreg Cross-Validation Score: {cross_val_scores}\n")
print(f"logreg F1 Score: {f1_score}\n")
print(f"logreg Precision: {precision_score}\n")
print(f"logreg Recall: {recall_score}\n\n")

# Générer une matrice de confusion
cm = confusion_matrix(y_test, y_pred)

# Créer une DataFrame à partir de la matrice de confusion pour une meilleure visualisation
cm_df = pd.DataFrame(cm, index=logreg.classes_, columns=logreg.classes_)

# Afficher la matrice de confusion
print(f"\logreg Confusion Matrix:\n")
print(cm_df)

# Créer une figure pour la matrice de confusion
plt.figure(figsize=(10, 7))
sns.heatmap(cm_df, annot=True, fmt='g')
plt.title(f'logreg Confusion Matrix')
plt.ylabel('True Label')
plt.xlabel('Predicted Label')
plt.show()