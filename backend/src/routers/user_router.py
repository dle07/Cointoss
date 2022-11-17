from base64 import encode
from pprint import pprint
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse

from fastapi.encoders import jsonable_encoder

from backend.src.db.user_mgr import getUserByEmail, registerUser
from backend.src.routers.models import UserLogin, UserRegistration



import bcrypt

from backend.src.utils.auth import encode_auth_token
router = APIRouter()



@router.post("/user/register")
async def register(userRegistration: UserRegistration):
    pprint(type(userRegistration))
    try:
        registerUser(userRegistration)
    except:
        pass


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



