from fastapi import APIRouter, Depends, HTTPException, Response, status

from sqlalchemy.orm import Session

from backend import models
from backend.database import get_db
from backend.routers.user.schemas import UserSignUp, VerifyOtpRequest, UserLogin
from backend.oauth2 import create_access_token
from backend.services.otp import generate_otp, verify_otp, generate_otp_message_template
from backend.services.email import send_email_to_user
from backend.services.crud.user import create_user_if_not_exists
from backend.services.utils.hashing import generate_password_hash, verify_password_hash

from typing import cast

import os

router = APIRouter(prefix='/user', tags=['User'])

otp_secret_key = os.environ['OTP_SECRET_KEY']


@router.post('/signup_via_otp')
def signup(user_info: UserSignUp, db: Session = Depends(get_db)):
    name = user_info.name
    email_id = user_info.email_id
    password = user_info.password

    otp = generate_otp(email=email_id, global_secret=otp_secret_key)

    user = db.query(models.PlatformUser).where(models.PlatformUser.email_id == email_id).first()

    if user and user.is_verified:
        raise HTTPException(status_code=400, detail='User already verified.')
        
    try:
        hashed_password = generate_password_hash(password)
        create_user_if_not_exists(db, name, email_id, hashed_password)

        send_email_to_user(
            email_id,
            generate_otp_message_template(otp)
        )

        return {'message': 'OTP sent successfully.'}
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail='An error occurred during signup')


@router.post('/verify_otp')
def verify_otp_route(verification_info: VerifyOtpRequest, response: Response, db: Session = Depends(get_db)):
    otp = verification_info.otp
    email_id = verification_info.email_id

    user = db.query(models.PlatformUser).where(models.PlatformUser.email_id == email_id).first()

    if not user:
        raise HTTPException(status_code=400, detail='User not found') 
    
    if not verify_otp(otp, email_id, otp_secret_key):
        raise HTTPException(status_code=401, detail='Invalid OTP')

    user.is_verified = True

    try:
        db.commit()
    except Exception as e:
        db.rollback()
        print(e)
        raise HTTPException(status_code=500, detail='An error occured at our server')

    access_token = create_access_token({
        'user_id': user.user_id
    })
    response.set_cookie('access_token', access_token)

    return {'message' : 'Verification successful'}
    
    
@router.post('/login')
def login(user_info: UserLogin, response: Response, db: Session = Depends(get_db)):
    
    email_id = user_info.email_id
    user = db.query(models.PlatformUser).where(models.PlatformUser.email_id == email_id).first()

    if not user or not verify_password_hash(user_info.password, cast(str, user.password)):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid credentials')

    access_token = create_access_token({
        'user_id': user.user_id
    })
    response.set_cookie('access_token', access_token)

    return {'message' : 'Login successful'}