from fastapi import FastAPI, Response

import uvicorn

from backend.src.routers import user_router, utility_router, user_portfolio_router


app = FastAPI()

app.include_router(utility_router.router)
app.include_router(user_router.router)
app.include_router(user_portfolio_router.router)
#python -m backend.src.main



if __name__ == "__main__":

    uvicorn.run(app="backend.src.main:app", host="0.0.0.0", port=5000, log_level="info", reload=False, workers=2)