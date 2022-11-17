from pprint import pprint
from fastapi import APIRouter, Response
import yfinance as yf
import requests
from bs4 import BeautifulSoup

router = APIRouter()

@router.get("/stock-data")
def get_stock_data(tickerSymbol, timePeriod=None): # valid periods: 1d,5d,1mo,3mo,6mo,1y,2y,5y,10y,ytd,max
	#data will be downloaded as a pandas.dataframe
	data = yf.download(tickerSymbol, period=timePeriod)
	#changing date column from index to regualar column
	data.reset_index(inplace=True)
	return Response(data.to_json(orient="records"), media_type="application/json") #formats into json format before returning

@router.get("/highest-volume")
def get_highest_volume_tickers(limit:int = 21):
	search_url = "https://www.tradingview.com/markets/stocks-usa/market-movers-active/"
	res = requests.get(url = search_url)
	soup = BeautifulSoup(res.content,'html.parser')
	for a in soup.find_all("tr", {'class':'row-EdyDtqqh listRow'}):
		print(type(a))
		print(a.prettify())
		break
		
	print(limit)
	
