from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy.orm import Session

from backend.database import get_db
from backend.routers.user.schemas import UserSignUp, VerifyOtpRequest
from backend.services.otp import generate_otp, verify_otp, generate_otp_message_template
from backend.services.email import send_email_to_user
from backend.services.crud.user import create_user_if_not_exists
from backend import models

import os

router = APIRouter(prefix='/user', tags=['User'])

otp_secret_key = os.environ['OTP_SECRET_KEY']


@router.post('/signup_via_otp')
async def signup(user_info: UserSignUp, db: Session = Depends(get_db)):
    name = user_info.name
    email_id = user_info.email_id
    password = user_info.password

    otp = generate_otp(email=email_id, global_secret=otp_secret_key)

    user = db.query(models.PlatformUser).where(models.PlatformUser.email_id == email_id).first()

    if user and user.is_verified:
        raise HTTPException(status_code=400, detail='User already verified.')
        
    try:
        create_user_if_not_exists(db, name, email_id, password)

        send_email_to_user(
            email_id,
            generate_otp_message_template(otp)
        )

        return {'message': 'OTP sent successfully.'}
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail='An error occurred during signup')


@router.post('/verify_otp')
async def verify_otp_route(verification_info: VerifyOtpRequest, db: Session = Depends(get_db)):
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

    # TODO: SET jwt token as cookie here
    return {'message' : 'Verification successful'}
    
    