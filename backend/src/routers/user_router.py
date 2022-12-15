from base64 import encode
from pprint import pprint
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse

from fastapi.encoders import jsonable_encoder
import re

from backend.src.db.user_mgr import getUserByEmail, registerUser
from backend.src.routers.models import UserLogin, UserRegistration



import bcrypt

from backend.src.utils.auth import encode_auth_token
router = APIRouter(tags=["User"])


 
# Define a function for
# for validating an Email
def validateEmail(email):
    if not re.match(r"^[A-Za-z0-9\.\+_-]+@[A-Za-z0-9\._-]+\.[a-zA-Z]*$", email):
        return False
    return True

@router.post("/user/register") 
async def register(userRegistration: UserRegistration):
    print(userRegistration.email)
    if not validateEmail(userRegistration.email) or userRegistration.email == "":
        raise HTTPException(status_code=422, detail = "Not a valid email. Please Input a valid email.")
    if (userRegistration.password == ""):
        raise HTTPException(status_code=422,detail = "Password cannot be empty" )
    
    registerUser(userRegistration)
    


@router.post("/user/login")
async def login(userLogin: UserLogin):
    
    result:tuple(3) = getUserByEmail(userLogin.user_email)

    if(result == None):
        raise HTTPException(status_code = 401,detail = "Email not found")
    if( bcrypt.checkpw(userLogin.password.encode(), result[2].encode()) == False ):
        raise HTTPException(status_code = 401, detail = "Invalid Credentials" )
    content = jsonable_encoder({           # Encode to json
        "auth_token": encode_auth_token(userLogin.user_email)

    })
    return JSONResponse(content)



