from flask import Blueprint, request, jsonify
from extensions import db
from models import Task
from flask_jwt_extended import jwt_required, get_jwt_identity

tasks_bp = Blueprint("tasks", __name__)

@tasks_bp.route("/tasks", methods=["GET"])
@jwt_required()
def get_tasks():
    user_id = get_jwt_identity()
    tasks = Task.query.filter_by(user_id=user_id).all()

    return jsonify([
        {
            "id": task.id,
            "label": task.label,
            "completed": task.completed
        } for task in tasks
    ]), 200


# Ruta para crear nueva tarea
@tasks_bp.route("/tasks", methods=["POST"])
@jwt_required()
def create_task():
    user_id = get_jwt_identity()
    data = request.get_json()
    label = data.get("label")

    if not label:
        return jsonify({"error": "La tarea debe tener un nombre"}), 400

    new_task = Task(label=label, user_id=user_id)
    db.session.add(new_task)
    db.session.commit()

    return jsonify({"msg": "Tarea creada", "task": {
        "id": new_task.id,
        "label": new_task.label,
        "completed": new_task.completed
    }}), 201


#Editar tarea existente
@tasks_bp.route("/tasks/<int:task_id>", methods=["PUT"])
@jwt_required()
def update_task(task_id):
    user_id = get_jwt_identity()
    task = Task.query.filter_by(id=task_id, user_id=user_id).first()

    if not task:
        return jsonify({"error": "Tarea no encontrada"}), 404

    data = request.get_json()
    task.label = data.get("label", task.label)
    task.completed = data.get("completed", task.completed)

    db.session.commit()

    return jsonify({"msg": "Tarea actualizada", "task": {
        "id": task.id,
        "label": task.label,
        "completed": task.completed
    }}), 200


#Eliminamos una tarea
@tasks_bp.route("/tasks/<int:task_id>", methods=["DELETE"])
@jwt_required()
def delete_task(task_id):
    user_id = get_jwt_identity()
    task = Task.query.filter_by(id=task_id, user_id=user_id).first()

    if not task:
        return jsonify({"error": "Tarea no encontrada"}), 404

    db.session.delete(task)
    db.session.commit()

    return jsonify({"msg": "Tarea eliminada"}), 200
