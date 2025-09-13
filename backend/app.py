from flask import Flask, jsonify
from config import Config
from extensions import db, jwt, migrate
from routes.auth import auth_bp
from routes.tasks import tasks_bp
import models  
from models import TokenBlocklist 

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Inicializar extensiones
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)   #activamos migrate

    @jwt.token_in_blocklist_loader
    def check_if_token_revoked(jwt_header, jwt_payload):
        jti = jwt_payload["jti"]
        return TokenBlocklist.query.filter_by(jti=jti).first() is not None

    app.register_blueprint(auth_bp, url_prefix="/")
    app.register_blueprint(tasks_bp, url_prefix="/")

    @app.route("/")
    def index():
        return jsonify({"ok": True, "msg": "API Flask running"})

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5000)
