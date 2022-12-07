from pprint import pprint
from fastapi import APIRouter, Response
import yfinance as yf
import requests
from bs4 import BeautifulSoup
from fastapi.responses import JSONResponse

from backend.src.utils import web_scrapper
from cachetools import cached, LRUCache, TTLCache
import time
router = APIRouter()

@router.get("/stock-data")
async def get_stock_data(tickerSymbol, timePeriod=None): # valid periods: 1d,5d,1mo,3mo,6mo,1y,2y,5y,10y,ytd,max
	#data will be downloaded as a pandas.dataframe
	data = yf.download(tickerSymbol, period=timePeriod)
	#changing date column from index to regualar column
	data.reset_index(inplace=True)
	return Response(data.to_json(orient="records"), media_type="application/json") #formats into json format before returning


@router.get("/highest-volume")
async def  get_highest_volume_tickers(limit:int = 21):

	@cached(cache=TTLCache(maxsize=50, ttl=1800))
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
	
	lst = get_highest_volume_tickers_func(limit)
	return JSONResponse(content={"tickers":lst})



# @router.get("/test_cache")
# async def test_cache(num:int):
# 	start_time = time.time()
# 	@cached(cache=TTLCache(maxsize=5000, ttl=1800))
# 	def recur_fibo(n):
# 		if n <= 1:
# 			return n
# 		else:
# 			return(recur_fibo(n-1) + recur_fibo(n-2))

# 	x = recur_fibo(num)
# 	print("--- %s seconds ---" % (time.time() - start_time))
# 	return x



