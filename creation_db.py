import csv
import sqlite3
import requests


url = "https://data.montreal.ca/dataset/05a9e718-6810-4e73-8bb9-5955efeb91a0' \
      '/resource/7f939a08-be8a-45e1-b208-d8744dca8fc6/download/violations.csv"
reponse = requests.get(url)
lines = reponse.text.splitlines()
data = csv.DictReader(lines)

# Connection to database(db will be created if doesnt exist)
con = sqlite3.connect('db/test.db')
cursor = con.cursor()


command1 = """CREATE TABLE IF NOT EXISTS
stores(store_id INTEGER PRIMARY KEY, location TEXT)"""

cursor.execute(command1)

command2 = """CREATE TABLE IF NOT EXISTS
purchases(purchase_id INTEGER PRIMARY KEY, store_id INTEGER, total_cost FLOAT, 
FOREIGN KEY(store_id) REFERENCES stores(store_id))"""

cursor.execute(command2)

cursor.execute("INSERT INTO purchases VALUES (23,64,21.12)")

cursor.execute("SELECT * FROM purchases")

results = cursor.fetchall()
con.commit()
con.close()
print(results)
