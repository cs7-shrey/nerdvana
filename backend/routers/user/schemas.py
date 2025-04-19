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
    
    
# --------------------------------------------------------------------------
# Response Schemas
# --------------------------------------------------------------------------