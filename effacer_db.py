import sqlite3

# Connect to the database
conn = sqlite3.connect('db/database.db')
c = conn.cursor()

# Clear all the data in the table
c.execute('DELETE FROM lawsuits')
c.execute('DELETE FROM users')

# Commit the changes and close the database connection
conn.commit()
conn.close()
