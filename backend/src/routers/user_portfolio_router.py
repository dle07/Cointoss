

from pprint import pprint
from typing import Union
from fastapi import APIRouter, Header, HTTPException
from fastapi.responses import JSONResponse
from backend.src.db.user_mgr import addStock
from backend.src.routers.models import UserStockAsset
from backend.src.utils.auth import getUserEmailFromJwt

from backend.src.utils.exception_decorators import jwt_exception_handler

router = APIRouter()


@router.post("/portfolio/add")
def add_portfolio_asset(asset: UserStockAsset, jwt_token: str = Header(default = None, description= "JWT Auth Token")):
    # Extract user id from token
    email = getUserEmailFromJwt(jwt_token)
    addStock(email, asset.ticker )

@router.post("/portfolio/delete")
def delete_portfolio_asset(asset: UserStockAsset, jwt_token: str = Header(default = None, description= "JWT Auth Token")):
    email = getUserEmailFromJwt(jwt_token)

    pass




# if(bearer_token == None):
#         raise ValueError("Did not Provide Bearer JWT Token")
#     if( bearer_token.beginswith("Bearer ") == False):
#         raise ValueError("Bearer token value does not begin with 'bearer '")