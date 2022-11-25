from fastapi import APIRouter, Header, HTTPException
from fastapi.responses import JSONResponse
from backend.src.db.user_mgr import addStock, retrieveTrackedStocks, deleteStock
from backend.src.routers.models import UserStockAsset
from backend.src.utils.auth import getUserEmailFromJwt
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse

from fastapi.encoders import jsonable_encoder
from backend.src.utils.exception_decorators import jwt_exception_handler

router = APIRouter()


@router.post("/portfolio/add")
async def add_portfolio_asset(asset: UserStockAsset, jwt_token: str = Header(default = None, description= "JWT Auth Token")):
    # Extract user id from token
    email = getUserEmailFromJwt(jwt_token)
    addStock(email, asset.ticker )

@router.delete("/portfolio/delete")
async def delete_portfolio_asset(asset: UserStockAsset, jwt_token: str = Header(default = None, description= "JWT Auth Token")):
    email = getUserEmailFromJwt(jwt_token)
    deleteStock(email, asset.ticker )
    

@router.get("/portfolio/retrieve")
async def get_portfolio(jwt_token: str = Header(default = None, description= "JWT Auth Token")):

    email = getUserEmailFromJwt(jwt_token)
    content = jsonable_encoder({           # Encode to json
        "user_email" : email,
        "tracked_tickers" : retrieveTrackedStocks(email)
    })
    return JSONResponse(content)




# if(bearer_token == None):
#         raise ValueError("Did not Provide Bearer JWT Token")
#     if( bearer_token.beginswith("Bearer ") == False):
#         raise ValueError("Bearer token value does not begin with 'bearer '")