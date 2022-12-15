from fastapi import FastAPI, Response

import uvicorn

from ML_Models import models


mlApp = FastAPI()

mlApp.include_router(models.router)
#python -m ML_Models

if __name__ == "__main__":

    uvicorn.run(app="ML_Models.main:mlApp", host="0.0.0.0", port=5001, log_level="info", reload=True, workers=2)