from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, Integer, String, Boolean

Base = declarative_base()

class PlatformUser(Base):
    __tablename__ = "platform_user"
    
    user_id = Column(Integer, primary_key=True, autoincrement=True) 
    name = Column(String, nullable=False)
    email_id = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    is_verified = Column(Boolean, nullable=False, default=False, server_default='false')    