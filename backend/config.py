import os
from dotenv import dotenv_values

config = {
    **dotenv_values(".env"),
    **os.environ # For docker deployment
}


def check_config() -> None:
    required_env_vars = [
        'ORM_DATABASE_URL',
        'JWT_SECRET_KEY',
        'ALGORITHM',
        'ACCESS_TOKEN_EXPIRE_MINUTES'
    ]
    
    for var in required_env_vars:
        if var not in config:
            raise ValueError(f"{var} is required")