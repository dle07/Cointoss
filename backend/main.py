from fastapi import FastAPI, Response
import yfinance

app = FastAPI()

@app.get("/stock-data")
def get_stock_data(tickerSymbol, timePeriod=None):# valid periods: 1d,5d,1mo,3mo,6mo,1y,2y,5y,10y,ytd,max
	#data will be downloaded as a pandas.dataframe
	data = yfinance.download(tickerSymbol, period=timePeriod)
	#changing date column from index to regualar column
	data.reset_index(inplace=True)
	return Response(data.to_json(orient="records"), media_type="application/json") #formats into json format before returning