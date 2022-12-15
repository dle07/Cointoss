from pprint import pprint
from fastapi import APIRouter, Response
import yfinance as yf
import requests
from bs4 import BeautifulSoup
from fastapi.responses import JSONResponse
from backend.src.utils.web_scrapper import queryByTickerGoogle, scrape_data_everything_endpoint
from cachetools import cached, LRUCache, TTLCache
from datetime import timedelta, datetime

router = APIRouter(tags=["Utility"])

@cached(cache=TTLCache(maxsize=50, ttl=timedelta(hours = 1) , timer=datetime.now))
def get_highest_volume_tickers_func(limit:int=21):
	if( limit > 100):
		limit = 100
	lst = []
	search_url = "https://www.tradingview.com/markets/stocks-usa/market-movers-active/"
	res = requests.get(url = search_url)
	soup = BeautifulSoup(res.content,'html.parser')
	for a in soup.find_all("tr", {'class':'row-EdyDtqqh listRow'}):
		ticker = a["data-rowkey"]
		lst.append(ticker.partition(":")[2])
		limit -=1
		if(limit == 0):
			break
	return lst

@cached(cache=TTLCache(maxsize=50, ttl=timedelta(hours = 10) , timer=datetime.now))
def get_stock_data_yf(tickerSymbol,timePeriod=None):
	#data will be downloaded as a pandas.dataframe
	data = yf.download(tickerSymbol, period=timePeriod)
	return data
	
@router.get("/stock-data")
async def get_stock_data(tickerSymbol, timePeriod=None): # valid periods: 1d,5d,1mo,3mo,6mo,1y,2y,5y,10y,ytd,max
	#changing date column from index to regualar column
	data = get_stock_data_yf(tickerSymbol,timePeriod)
	data.reset_index(inplace=True)
	return Response(data.to_json(orient="records"), media_type="application/json") #formats into json format before returning

@router.get("/highest-volume")
async def  get_highest_volume_tickers(limit:int = 21):

	
	lst = get_highest_volume_tickers_func(limit)
	return JSONResponse(content={"tickers":lst})

@router.get("/scrape_data_headlines")
async def scapre_data_headlines(ticker:str):
	if(ticker.startswith("$")==False):
		ticker = '$' + ticker
	return queryByTickerGoogle(ticker)

@router.get("/scrape_data", description="Gives Twitter, Reddit, and News Articles")
async def scrape_data(ticker:str):
	if(ticker.startswith("$")==False):
		ticker = '$' + ticker
	return scrape_data_everything_endpoint(ticker)




	