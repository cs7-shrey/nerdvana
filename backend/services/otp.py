import base64
import pyotp
import hashlib

def generate_user_secret(email: str, global_secret: str) -> str:
    # Create a SHA-256 hash
    hash_digest = hashlib.sha256((email + global_secret).encode()).digest()
    # Convert to base32 and remove padding '=' characters
    base32_encoded = base64.b32encode(hash_digest).decode('utf-8').replace('=', '')
    return base32_encoded

def generate_otp(email: str, global_secret: str, interval: int = 60) -> str:
    user_secret = generate_user_secret(email, global_secret)
    totp = pyotp.totp.TOTP(user_secret, interval=interval)
    return totp.now()   

def verify_otp(otp: str, email: str, global_secret: str, interval: int = 60) -> bool:
    user_secret = generate_user_secret(email, global_secret)
    totp = pyotp.totp.TOTP(user_secret, interval=interval)
    return totp.verify(otp, valid_window=1)

def generate_otp_message_template(otp: str) -> str:
    return f"""
        Your OTP for verification to nerdvana is <b>{otp}</b>.
    """