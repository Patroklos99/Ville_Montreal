from functools import wraps
from flask import make_response, request, jsonify, current_app


def auth_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.authorization
        if auth and auth.username == "username" and auth.password == 'password':
            return f(*args, **kwargs)
        return make_response(jsonify({"message": f"You have successfully logged in"}), 401,
                             {'WWW-Authenticate': 'Basic realm="Login required!"'})

    return decorated
