from pprint import pprint
from fastapi import HTTPException
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse


def jwt_exception_handler(func):
    def inner_func(*args, **kwargs):
        try:
            func(*args, **kwargs)
        except Exception as e:
            pprint(str(e))
            raise HTTPException(status_code = 401, detail = str(e) )
    return inner_func