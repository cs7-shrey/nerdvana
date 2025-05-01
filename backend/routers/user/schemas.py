from pydantic import BaseModel, EmailStr


# --------------------------------------------------------------------------
# Request Schemas
# --------------------------------------------------------------------------

class UserSignUp(BaseModel):
    name: str
    email_id: EmailStr
    password: str

class VerifyOtpRequest(BaseModel):
    otp: str
    email_id: EmailStr 

class UserLogin(BaseModel):
    email_id: EmailStr
    password: str
    
    
# --------------------------------------------------------------------------
# Response Schemas
# --------------------------------------------------------------------------

class TokenData(BaseModel):
    user_id: str