from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate  # Importar Flask-Migrate


# Crear instancia de SQLAlchemy
db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config.from_object('backend.config.Config')
    
        # Configurar tu clave secreta
    app.config['JWT_SECRET_KEY'] = 'claveSuperSecreta'  # Cambia esto a una clave secreta fuerte en producción

    # Inicializar JWTManager
    jwt = JWTManager(app)

    # Inicializar SQLAlchemy
    db.init_app(app)
    
    migrate.init_app(app, db)

    # Habilitar CORS
    CORS(app)

    # Importar y registrar blueprints después de inicializar db
    from .routes import api
    app.register_blueprint(api)

    return app
