from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, JWTManager
from flask import Blueprint, request, jsonify
from . import db
from .models import User, Team
from werkzeug.security import generate_password_hash, check_password_hash

api = Blueprint('api', __name__)

@api.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([user.serialize() for user in users])

@api.route('/users/signup', methods=['POST'])
def add_user():
    data = request.json
    if 'name' not in data or 'email' not in data or 'password' not in data:
        return jsonify({'error': 'Missing data'}), 400
    
    hashed_password = generate_password_hash(data['password'])  # Hash the password

    new_user = User(
        name=data['name'],
        email=data['email'],
        password=hashed_password
    )

    db.session.add(new_user)
    db.session.commit()
        # Crear un token de acceso
    access_token = create_access_token(identity=new_user.id)

    return jsonify({
        "msg": "Usuario creado exitosamente",
        "access_token": access_token,
        'id': new_user.id,
        'name': new_user.name,
        'email': new_user.email}), 201

@api.route('/users/delete/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get(user_id)

       # Verificar si el usuario existe
    if user is None:
        return jsonify({"message": "User not found"}), 400

    # Eliminar el usuario de la base de datos
    try:
        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": "User deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@api.route('/users/edit/<int:user_id>', methods=['PUT'])
def edit_user(user_id):
    user = User.query.get(user_id)
    # Verificar si el usuario existe
    if user is None:
        return jsonify({"message": "User not found"}), 404

    data = request.json  # Obtén los datos del cuerpo de la solicitud

    # Verificar si se enviaron datos
    if not data:
        return jsonify({"message": "No data provided"}), 400

    # Actualizar el usuario con los nuevos datos
    try:
        user.name = data.get('name', user.name)  # Actualiza el campo name si se proporciona
        user.email = data.get('email', user.email)  # Actualiza el campo email si se proporciona
        user.password = data.get('password', user.password)  # Actualiza el campo password si se proporciona

        db.session.commit()  # Guarda los cambios en la base de datos

        return jsonify({"message": "User updated successfully"}), 200

    except Exception as e:
        db.session.rollback()  # Revierte los cambios en caso de error
        return jsonify({"error": str(e)}), 500
    

@api.route("/login", methods=["POST"])
def create_token():
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    # Consulta la base de datos por el nombre de usuario y la contraseña
    user = User.query.filter_by(email=email).first()

    if user is None:
        # el usuario no se encontró en la base de datos
        return jsonify({"msg": "Bad username or password"}), 401

    if not check_password_hash(user.password, password):
        # Incorrect password
        return jsonify({"msg": "Bad username or password"}), 401

    # Crea un nuevo token con el id de usuario dentro
    access_token = create_access_token(identity=user.id)
    return jsonify({ "token": access_token, "user_id": user.id, "email":user.email, "name": user.name, 'userId': user.id  })


@api.route('/user/<int:user_id>/favorite_team', methods=['GET'])
def get_user_favorite_team(user_id):
    user = User.query.get(user_id)
    if user is None:
        return jsonify({'error': 'User not found'}), 404

    if user.favorite_team is None:
        return jsonify({'error': 'No favorite team found'}), 404

    return jsonify(user.favorite_team.serialize())

@api.route('/users/<int:user_id>', methods=['GET'])
def get_users_details(user_id):
    user = User.query.get(user_id)
    if user is None:
        return jsonify({'error': 'User not found'}), 404

    usuario = {
        'id': user.id,
        'name': user.name,
        'email': user.email
    }
    return jsonify(usuario)


@api.route('/user/<int:user_id>/favorite_team', methods=['PUT'])
def update_favorite_team(user_id):
    data = request.get_json()
    user = User.query.get(user_id)
    if user:
        user.favorite_team_id = data.get('team_id')
        db.session.commit()
        return jsonify({'message': 'Favorite team updated'})
    else:
        return jsonify({'error': 'User not found'}), 404

@api.route('/teams', methods=['GET'])
def get_teams():
    teams = Team.query.all()
    return jsonify([{'id': team.id, 'name': team.name} for team in teams])



@api.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    # Accede a la identidad del usuario actual con get_jwt_identity
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    return jsonify({"id": user.id }), 200
