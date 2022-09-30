from fastapi import FastAPI, Response
import yfinance

app = FastAPI()

@app.get("/stock-data")
def get_stock_data(tickerSymbol):
	#data will be downloaded as a pandas.dataframe
	data = yfinance.download(tickerSymbol)
	#changing date column from index to regualar column
	data.reset_index(inplace=True)
	return Response(data.to_json(orient="records"), media_type="application/json") #formats into json format before returning