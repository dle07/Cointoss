from fastapi import APIRouter, Response
import yfinance as yf

router = APIRouter()

@router.get("/stock-data")
def get_stock_data(tickerSymbol):
	#data will be downloaded as a pandas.dataframe
	data = yf.download(tickerSymbol)
	#changing date column from index to regualar column
	data.reset_index(inplace=True)
	return Response(data.to_json(orient="records"), media_type="application/json") #formats into json format before returning