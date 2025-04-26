import os 

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from typing import Generator

ORM_URL = os.environ['ORM_DATABASE_URL']

engine = create_engine(ORM_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db() -> Generator[Session, None, None]:     # Generator[YieldType, SendType, ReturnType]
    db = SessionLocal()
    try: 
        yield db
    finally:
        db.close()