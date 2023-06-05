import csv
import sqlite3
import requests

url = 'https://data.montreal.ca/dataset/05a9e718-6810-4e73-8bb9-5955efeb91a0/resource/7f939a08-be8a-45e1-b208' \
      '-d8744dca8fc6/download/violations.csv'
response = requests.get(url)
content = response.content.decode('utf-8')
lawsuits = csv.DictReader(content.splitlines())

# Connection to db(db will be created if doesnt exist)
con = sqlite3.connect('db/database.db')
cursor = con.cursor()

# Fetch lines and Insert Data into db
for lawsuit in lawsuits:
    id_poursuite = lawsuit['id_poursuite']
    buisness_id = lawsuit['business_id']
    date = lawsuit['date']
    description = lawsuit['description']
    adresse = lawsuit['adresse']
    date_jugement = lawsuit['date_jugement']
    etablissement = lawsuit['etablissement']
    montant = lawsuit['montant']
    proprietaire = lawsuit['proprietaire']
    ville = lawsuit['ville']
    statut = lawsuit['statut']
    date_statut = lawsuit['date_statut']
    categorie = lawsuit['categorie']
    cursor.execute("INSERT INTO lawsuits (id_poursuite, buisness_id, date, "
                   "description, adresse, date_jugement, etablissement, montant, "
                   "proprietaire, ville, statut, date_statut, categorie) VALUES ("
                   "?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", (id_poursuite,
                                                              buisness_id, date,
                                                              description,
                                                              adresse,
                                                              date_jugement,
                                                              etablissement,
                                                              montant,
                                                              proprietaire,
                                                              ville, statut,
                                                              date_statut,
                                                              categorie))

# cursor.execute("SELECT * from lawsuits")
# results = cursor.fetchall()
# print(results)
con.commit()
con.close()
