from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from config import Config
from models import db
from routes.auth import auth_bp
from routes.books import books_bp
from routes.members import members_bp
from flask import  render_template,url_for

app = Flask(__name__)
app.config.from_object(Config)

# Initialize extensions
db.init_app(app)
jwt = JWTManager(app)
CORS(app)

# Register blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(books_bp)
app.register_blueprint(members_bp)

# Database creation
# @app.before_first_request
# def create_tables():
#     db.create_all()

# Render Login Page (GET request)
@app.route('/', methods=['GET'])
def login_page():
    return render_template('index.html')

# Render Login Page (GET request)
@app.route('/register', methods=['GET'])
def reg_page():
    return render_template('register.html')

# Render Login Page (GET request)
@app.route('/books', methods=['GET'])
def books_page():
    return render_template('books.html')

# Render Login Page (GET request)
@app.route('/members', methods=['GET'])
def memebers_page():
    return render_template('members.html')

if __name__ == "__main__":
    with app.app_context():
        db.create_all()  # Ensure database tables are created within the app context
    app.run(debug=True)