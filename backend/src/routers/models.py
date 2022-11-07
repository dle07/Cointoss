from pydantic import BaseModel

class UserRegistration(BaseModel):
    email: str
    password: str

class UserLogin(BaseModel):
    user_email:str
    password:str




##########



class UserStockAsset(BaseModel):
    ticker:str
    quantity:str

