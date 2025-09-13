from flask import Blueprint, request, jsonify
from extensions import db, jwt
from models import User, TokenBlocklist
from flask_jwt_extended import (
    create_access_token, 
    jwt_required, 
    get_jwt_identity,
    get_jwt
)
from datetime import timedelta

auth_bp = Blueprint("auth", __name__)

#Registro de usuarios
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        return jsonify({"error": "Faltan campos obligatorios"}), 400

    # Verificar que no exista ya el usuario
    if User.query.filter((User.username == username) | (User.email == email)).first():
        return jsonify({"error": "El usuario o email ya existe"}), 400

    new_user = User(username=username, email=email)
    new_user.set_password(password)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "Usuario registrado con éxito"}), 201


#Login
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return jsonify({"error": "Credenciales inválidas"}), 401

    access_token = create_access_token(
        identity=user.id,
        expires_delta=timedelta(hours=1) 
    )

    return jsonify({"token": access_token, "user": {"id": user.id, "username": user.username}}), 200


@auth_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    jti = get_jwt()["jti"]  # ID único del token
    db.session.add(TokenBlocklist(jti=jti))
    db.session.commit()
    return jsonify({"msg": "Sesión cerrada"}), 200


#Ver perfil del usuario autenticado
@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    return jsonify({
        "id": user.id,
        "username": user.username,
        "email": user.email
    }), 200
