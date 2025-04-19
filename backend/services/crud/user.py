from backend import models
from sqlalchemy.orm import Session


def create_user(
    db: Session, name: str, email_id: str, password: str, is_verified: bool = False
) -> models.PlatformUser:
    user = models.PlatformUser(name=name, email_id=email_id, password=password, is_verified=is_verified)

    db.add(user)
    db.commit()
    db.refresh(user)

    return user

def create_user_if_not_exists(
    db: Session, name: str, email_id: str, password: str, is_verified: bool = False
) -> models.PlatformUser:

    user = db.query(models.PlatformUser).where(models.PlatformUser.email_id == email_id).first()
    
    if user:
        return user

    return create_user(db, name, email_id, password, is_verified)
    
