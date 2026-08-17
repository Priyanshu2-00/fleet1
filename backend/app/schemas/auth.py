from pydantic import BaseModel, EmailStr
from datetime import datetime
from uuid import UUID
from app.core.enums import UserRole, UserStatus

class RegisterRequest(BaseModel):
    name: str
    phone: str
    email: EmailStr
    password: str
    role: UserRole

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserResponse(BaseModel):
    id: UUID
    name: str
    phone: str
    email: str
    role: UserRole
    status: UserStatus
    created_at: datetime

    class Config:
        from_attributes = True
