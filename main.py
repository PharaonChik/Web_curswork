import sqlite3

data_bay = sqlite3.connect("shob.db")
db = data_bay.cursor()

db.execute("""CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    login TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user'
    )
""")


db.execute("""CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    category TEXT NOT NULL,
    photo TEXT NOT NULL
    )
""")


db.execute("""CREATE TABLE IN NOT EXISTS card (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    
    )""")


data_bay.commit()
data_bay.close()