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


db.execute("""CREATE TABLE IF NOT EXISTS cart (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quantity INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
    )
""")


    
db.execute("INSERT INTO users (name, login, password) VALUES (?,?,?)", ("Rustam", "rustam", "123456"))
db.execute("INSERT INTO users (name, login, password) VALUES (?,?,?)", ("Max", "max", "2222"))
db.execute("INSERT INTO users (name, login, password) VALUES (?,?,?)", ("Lia", "lia", "3333"))
db.execute("INSERT INTO users (name, login, password) VALUES (?,?,?)", ("Dima", "dima", "4444"))

db.execute("INSERT INTO users (name, login, password, role) VALUES (?,?,?,?)", ("Admin", "admin", "1111", "admin"))


db.execute("INSERT INTO products (name, description, price, category, photo) VALUES (?,?,?,?,?)", ("100% Whey Gold Standard - 2,27кг", "Optimum Nutrition • США", 5259, "Протеїн", ""))
db.execute("INSERT INTO products (name, description, price, category, photo) VALUES (?,?,?,?,?)", ("Whey-Pro FUSION - 1кг", "Amix • Великобританія", 2299, "Протеїн", "static/img/Whey-Pro FUSION - 1кг.jpg"))
db.execute("INSERT INTO products (name, description, price, category, photo) VALUES (?,?,?,?,?)", ("Whey-Pro FUSION - 500г", "Amix • Великобританія", 1249, "Протеїн", "static/img/Whey-Pro FUSION - 500г.jpg"))
db.execute("INSERT INTO products (name, description, price, category, photo) VALUES (?,?,?,?,?)", ("100% Standard Whey - 2кг", "Sporter • Україна", 2999, "Протеїн", "static/img/100_ Standard Whey - 2кг.jpg"))




db.execute("INSERT INTO products (name, description, price, category, photo) VALUES (?,?,?,?,?)", ("Creatine monohydrate - 300г", "Sporter • Україна", 369, "Креатин", "static/img/Creatine monohydrate - 300г.jpg"))
db.execute("INSERT INTO products (name, description, price, category, photo) VALUES (?,?,?,?,?)", ("Creatine Gummies - 150 жув.таб - апельсин (без цукру)", "Sporter • Україна", 1045, "Креатин", "static/img/Creatine Gummies - 150 жув.таб - апельсин (без цукру).jpg"))
db.execute("INSERT INTO products (name, description, price, category, photo) VALUES (?,?,?,?,?)", ("Animal Creatine Powder - 500г", "Animal Nutrition (Universal) • США", 1499, "Креатин", "static/img/Animal Creatine Powder - 500г.jpg"))
db.execute("INSERT INTO products (name, description, price, category, photo) VALUES (?,?,?,?,?)", ("Amix Creatine monohydrate - 500г", "Amix • Великобританія", 865, "Креатин", "static/img/Amix Creatine monohydrate - 500г.jpg"))


db.execute("INSERT INTO products (name, description, price, category, photo) VALUES (?,?,?,?,?)", ("Applied Nutrition Shred - X Extreme Thermogenic 300г", "porter • Україна", 1650, "Boosters", "static/img/Applied Nutrition Shred - X Extreme Thermogenic 300г.jpg"))
db.execute("INSERT INTO products (name, description, price, category, photo) VALUES (?,?,?,?,?)", ("FA GAMERIZE Energy 280 g", "Sporter • Україна", 775, "Boosters", "static/img/FA GAMERIZE Energy 280 g.jpg"))
db.execute("INSERT INTO products (name, description, price, category, photo) VALUES (?,?,?,?,?)", ("ActivLab Black Wolf 300 g", "Sporter • Україна", 695, "Boosters", "static/img/ActivLab Black Wolf 300 g.jpg"))
db.execute("INSERT INTO products (name, description, price, category, photo) VALUES (?,?,?,?,?)", ("Kevin Levrone Maryland Muscle Machine 385 g", "Ostrovit • Польща", 895, "Boosters", "static/img/Kevin Levrone Maryland Muscle Machine 385 g.jpg"))


db.execute("INSERT INTO products (name, description, price, category, photo) VALUES (?,?,?,?,?)", ("Calcium Magnesium Zinc - 120таб", "Sporter • Україна", 359, "Вітаміни", "/"))
db.execute("INSERT INTO products (name, description, price, category, photo) VALUES (?,?,?,?,?)", ("Vitamin D3 2000 MО - 120 гелевих капсул", "Sporter • Україна", 245, "Вітаміни", "/"))
db.execute("INSERT INTO products (name, description, price, category, photo) VALUES (?,?,?,?,?)", ("Opti - Women 60 капс (Europe)", "Optimum Nutrition • США", 985, "Вітаміни", "/"))
db.execute("INSERT INTO products (name, description, price, category, photo) VALUES (?,?,?,?,?)", ("Vitamin D3+K2 - 90 софт гель", "Ostrovit • Польща", 369, "Вітаміни", "/"))



data_bay.commit()
data_bay.close() 