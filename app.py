from flask import Flask, render_template, redirect, request, session
from sql import select_arguments, delete_products, insert_products, log_user, insert_users, update_products
import os

app = Flask(__name__)
app.secret_key = os.environ.get('FLASK_SECRET_KEY', 'dev-secret-key-sportpit-2026')

@app.route('/')
def home():
    return render_template('index.html', my_products=select_arguments('products'), users=select_arguments('users'))


@app.route('/admin/delete_product/<int:id>', methods=['POST'])
def dell(id):
    delete_products('products', id)
    return redirect('/')


@app.route('/admin/add_product', methods=['POST'])
def add():
    name = request.form['name']
    price = request.form['price']
    category = request.form['category']
    photo = request.form['photo']
    description = request.form['description']
    
    insert_products(name, description, price, category, photo)
    return redirect('/')

@app.route("/login" , methods=["POST"])
def login_user():
    logins = request.form['login']
    password = request.form['password']
    user = log_user(logins, password)
    if user is None: 
        return redirect("/")
    else:
        session['user_id']= user[0]
        session['user_name']= user[1]
        session['user_role']= user[4]
        return redirect('/')
        
@app.route('/logout')
def logout():
    session.clear()
    return redirect('/')

@app.route("/register", methods = ['POST'])
def register():
    name = request.form['name']
    login = request.form['login']
    password = request.form['password']
    insert_users(name, login, password)
    return redirect('/')

@app.route("/admin/edit_product", methods=['POST'])
def update():
    id = request.form['id']
    name = request.form['name']
    price = request.form['price']
    category = request.form['category']
    photo = request.form['photo']
    description = request.form['description']
    
    update_products(name, price, category, photo, description, id)
    return redirect('/')

if __name__ == "__main__":
    app.run(debug=True)