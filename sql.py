import sqlite3
DB_NAME=("shob.db")


def insert_users(ins_name, ins_login, ins_password):
    data_bay = sqlite3.connect(DB_NAME)
    db = data_bay.cursor()
    db.execute("INSERT INTO users (name, login, password) VALUES (?,?,?)", (ins_name, ins_login, ins_password))
    data_bay.commit()
    data_bay.close()
    
    
def insert_products(ins_name, ins_description, ins_price, ins_category, ins_photo):
    data_bay = sqlite3.connect(DB_NAME)
    db = data_bay.cursor()
    db.execute("INSERT INTO products (name, description, price, category, photo) VALUES (?,?,?,?,?)", (ins_name, ins_description, ins_price, ins_category, ins_photo))
    data_bay.commit()
    data_bay.close()
    
    
def delete_products(tablename, delid):
    data_bay = sqlite3.connect(DB_NAME)
    db = data_bay.cursor()
    
    db.execute(f'DELETE FROM {tablename} WHERE id=?', (delid,))
    data_bay.commit()
    data_bay.close()
    

def select_arguments(tablename2):
    data_bay = sqlite3.connect(DB_NAME)
    db = data_bay.cursor()
    db.execute(f"SELECT * FROM {tablename2}")
    result = db.fetchall()
    data_bay.commit()
    data_bay.close()
    return result


def log_user(user_login, user_password):
    data_bay = sqlite3.connect(DB_NAME)
    db = data_bay.cursor()
    db.execute('SELECT * FROM users WHERE login=? AND password=?', (user_login, user_password))
    result = db.fetchone()
    data_bay.commit()
    data_bay.close()
    return result


def update_products(new_name, new_price, new_category, new_photo, new_description, new_id):

    data_bay = sqlite3.connect(DB_NAME)
    db = data_bay.cursor()
    
    db.execute(
        "UPDATE products SET name=?, price=?, category=?, photo=?, description=? WHERE id=?", 
        (new_name, new_price, new_category, new_photo, new_description, new_id))
    
    data_bay.close()
    