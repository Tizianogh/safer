import numpy as np
import pandas as pd
from pathlib import Path
path = Path(__file__).parent
def merge(df1,df2,df3,df4,df5):
    df1["Year"] = 2017
    df2["Year"] = 2018
    df3["Year"] = 2019
    df4["Year"] = 2020
    df5["Year"] = 2021
    return pd.concat([df1, df2, df3,df4,df5],axis=0)
    
def remove_zero(x):
    if len(str(x)) == 3:
        return int(str(x)[:-1])
    else:
        return x

#Pour chaque en fonction de l'année, faut que bonhomme ait entre 7 et 100 remplace par médiane 
def annee_naiss(an,year,mediane):
    tan=year-an
    if(tan>100 or tan<=7 ):
        return mediane
    return an
def trait_annee_naiss(df,year):
    mediane =df['an_nais'].median()
    df=df.fillna({'an_nais':mediane})
    df['an_nais']=df['an_nais'].apply(lambda x:annee_naiss(x,year,mediane))
    df['an_nais']=df['an_nais'].astype(int)
    return df



def nvxcorse(d):
   if(d=='2B' or d=='2A'):
        return 20
   return d
def repare_lat_long(d,long):
    if len(d) >= 4:


        d = d[:-2] + d[-1]

        if(long==0):
            first_char = d[:2]
            rest_of_string = d[2:]
            return first_char + '.' + rest_of_string [:-1]
        if(long==1):
            first_char = d[0]
            rest_of_string = d[1:]
            return first_char + '.'+rest_of_string[:-1]
def clean(type,df):
    if type=="Caracteristiques":
        df = df.drop('adr', axis=1)
        #df=df.drop(df.isin(domtom),axis=0)
        df['dep'] = df['dep'].replace([971,972,973,974,975,976,984,986,977,978,987,988],'suppr')
        df['dep'] = df['dep'].replace(['971','972','973','974','975','976','984','986','978','977','987','988'],'suppr')
        df = df.drop(df[df['dep']=='suppr'].index)
        df["dep"] = df["dep"].apply(remove_zero)
        df = df.dropna(subset=['lat', 'long'])
        df["dep"] = df["dep"].apply(nvxcorse)
        df=df.drop('gps',axis=1)
        df=df.drop('an',axis=1)
        df=df.drop('com',axis=1)
        df=df.drop('hrmn',axis=1)
        df=df.rename(columns={'long':'longi'})
    if type=="Usagers": 
        df=df.drop([ 'place','etatp','id_vehicule'], axis=1)
        df=df.drop(['secu1','secu2','secu3','secu'],axis = 1)
        df = df[df['catu'] == 1]
        df = df.drop('locp',axis=1)
        df=df.drop('actp',axis=1)
        #df=df.drop(['secu1','secu2','secu3','actp'])
    if type=="Vehicules":
        df=df.drop(['manv', 'motor','occutc','id_vehicule'], axis=1)
        df['catv'] = df['catv'].replace([1,60,80],2) #véhicule non motorisé
        df['catv'] = df['catv'].replace([2,30,31,32,33,34,41,42,43],1) #2/3 roues motorisé
        df['catv'] = df['catv'].replace([13,14,15,16,17,20],3) #Poids lourd
        df['catv'] = df['catv'].replace([3,35,36,50],4) #Petit vehicule pouvant être conduit sur la chaussée
        df['catv'] = df['catv'].replace([7,10,21],5) #Véhicule utilitaire
        df['catv'] = df['catv'].replace([37,38,39,40],6) #Transport en commun
        df['catv'] = df['catv'].replace(-1,0)#vide
        #regrouper
    if type=="Lieux":
        df=df.drop(['voie', 'v1','v2','pr','pr1','nbv','env1','lartpc','larrout','vma'], axis=1)
        df['plan']=df['plan'].replace(0,-1)
        df['prof']=df['prof'].replace(0,-1)
        df['surf']=df['surf'].replace(0,-1)

    return df

def big_merge(df1,df2,df3,df4):
    merged_df = pd.merge(df1, df2, on=['Num_Acc', 'num_veh'])
    #merged_df = merged_df.drop_duplicates(subset=['Num_Acc', 'num_veh',])
    merged_df = pd.merge(merged_df, df3, on='Num_Acc')
    merged_df = pd.merge(merged_df, df4, on='Num_Acc')
    merged_df= merged_df.drop_duplicates()
    return merged_df
def carac():
    df1= pd.read_csv(path /'caracteristiques/caracteristiques-2017.csv',encoding = "ISO-8859-1")
    df1['lat'] = df1['lat'].astype(str)
    df1['lat'] = df1['lat'].apply(lambda x: repare_lat_long(x,0))
    df1['long'] = df1['long'].astype(str)
    df1['long'] = df1['long'].apply(lambda x: repare_lat_long(x,1))
    df2= pd.read_csv(path /'caracteristiques/caracteristiques-2018.csv',encoding = "ISO-8859-1")
    df2['lat'] = df2['lat'].astype(str)
    df2['lat'] = df2['lat'].apply(lambda x: repare_lat_long(x,0))
    df2['long'] = df2['long'].astype(str)
    df2['long'] = df2['long'].apply(lambda x: repare_lat_long(x,1))
    #df1['lat'] = df1['lat'].astype(str)
    #df1['long'] = df1['long'].apply(lambda x: repare_lat_long(x,1))

    df3= pd.read_csv(path /'caracteristiques/caracteristiques-2019.csv',encoding = "ISO-8859-1", delimiter=";")
    df4= pd.read_csv(path /'caracteristiques/caracteristiques-2020.csv',encoding = "ISO-8859-1", delimiter=";")
    df5= pd.read_csv(path /'caracteristiques/caracteristiques-2021.csv',encoding = "ISO-8859-1", delimiter=";")
    res= merge(df1,df2,df3,df4,df5)
    res= clean("Caracteristiques",res)
    return res
    #res.to_csv(path /'caracteristiques.csv',index=False)#on exporte en csv 

def users():
    df1= pd.read_csv(path /'usagers/usagers-2017.csv',encoding = "ISO-8859-1")
    df1= trait_annee_naiss(df1,2017)
    df2= pd.read_csv(path /'usagers/usagers-2018.csv',encoding = "ISO-8859-1")
    df2= trait_annee_naiss(df2,2018)
    df3= pd.read_csv(path /'usagers/usagers-2019.csv',encoding = "ISO-8859-1", delimiter=";")
    df3= trait_annee_naiss(df3,2019)
    df4= pd.read_csv(path /'usagers/usagers-2020.csv',encoding = "ISO-8859-1", delimiter=";")
    df4= trait_annee_naiss(df4,2020)
    df5= pd.read_csv(path /'usagers/usagers-2021.csv',encoding = "ISO-8859-1", delimiter=";")
    df5= trait_annee_naiss(df5,2021)

    res= merge(df1,df2,df3,df4,df5)
    res= clean("Usagers",res)
    res.drop(res['Year'])
    res=res.drop('Year',axis=1)
    return res
    #res.to_csv(path /'usagers.csv',index=False)#on exporte en csv 

def vehicules():
    df1= pd.read_csv(path /'vehicules/vehicules-2017.csv',encoding = "ISO-8859-1")
    df2= pd.read_csv(path /'vehicules/vehicules-2018.csv',encoding = "ISO-8859-1")
    df3= pd.read_csv(path /'vehicules/vehicules-2019.csv',encoding = "ISO-8859-1", delimiter=";")
    df4= pd.read_csv(path /'vehicules/vehicules-2020.csv',encoding = "ISO-8859-1", delimiter=";")
    df5= pd.read_csv(path /'vehicules/vehicules-2021.csv',encoding = "ISO-8859-1", delimiter=";")
    res= merge(df1,df2,df3,df4,df5)
    res= clean("Vehicules",res)
    res=res.drop('Year',axis=1)
    return res
    #res.to_csv(path /'vehicules.csv',index=False)#on exporte en csv 

def lieu():
    df1= pd.read_csv(path /'lieux/lieux-2017.csv',encoding = "ISO-8859-1")
    df2= pd.read_csv(path /'lieux/lieux-2018.csv',encoding = "ISO-8859-1")
    df3= pd.read_csv(path /'lieux/lieux-2019.csv',encoding = "ISO-8859-1", delimiter=";")
    df4= pd.read_csv(path /'lieux/lieux-2020.csv',encoding = "ISO-8859-1", delimiter=";")
    df5= pd.read_csv(path /'lieux/lieux-2021.csv',encoding = "ISO-8859-1", delimiter=";")
    res= merge(df1,df2,df3,df4,df5)
    res= clean("Lieux",res)
    res.drop(res['Year'])
    res=res.drop('Year',axis=1)
    return res
    #res.to_csv(path /'lieux.csv',index=False)#on exporte en csv 


df2=vehicules()# on associe vehicule a user puis à l'accident puis au lieu
df1=users()
df3=carac()
df4=lieu()
res=big_merge(df1,df2,df3,df4)
#   res= res.drop(res.index[200000:])
#res=res.fillna('null')
#print(res.iloc[74])
res=res.fillna({'atm':-1,'trajet':0,'senc':-1,'obs':-1,'obsm':-1,'choc':-1,'col':-1,'circ':-1,'vosp':-1,'prof':-1,'plan':-1,'surf':-1,'infra':-1,'situ':-1,'lat':-1,'longi':-1})
res=res.drop('catu',axis=1)
res = res.astype({'dep':'int','lat':'string','longi':'string'})
res['lat']=res['lat'].str.replace(".",",")
res['longi']=res['longi'].str.replace(".",",")
#res=res.dropna(axis='rows')

res.to_csv(path /'merged.csv',index=False)#on exporte en csv 
