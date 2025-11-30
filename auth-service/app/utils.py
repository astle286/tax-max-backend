import jwt
from datetime import datetime, timedelta
from config import Config

def generate_token(user):
    payload = {
        "sub": user.id,
        "username": user.username,
        "role": user.role,
        "exp": datetime.utcnow() + timedelta(hours=1)
    }
    token = jwt.encode(payload, Config.JWT_SECRET, algorithm="HS256")

    # Ensure token is a string (not bytes)
    if isinstance(token, bytes):
        token = token.decode("utf-8")

    return token

def decode_token(token):
    print("Received token:", token)
    try:
        payload = jwt.decode(token, Config.JWT_SECRET, algorithms=["HS256"])
        print("Decoded payload:", payload)
        return payload
    except jwt.ExpiredSignatureError:
        print("Token expired")
        raise ValueError("Token expired")
    except jwt.InvalidTokenError as e:
        print("Invalid token:", e)
        raise ValueError("Invalid token")

