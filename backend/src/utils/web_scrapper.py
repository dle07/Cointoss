import csv
import re
from datetime import datetime, timedelta
from pathlib import Path
from pprint import pprint
from concurrent.futures import ThreadPoolExecutor
from concurrent.futures import as_completed, wait
import praw
import requests
import tweepy
from bs4 import BeautifulSoup
from backend.src.utils.ConfigUtils import ConfigUtils

from newspaper import Article
from itertools import repeat

from backend.src.utils.storage_utils import create_csv_path

TWITTER_API_KEY = ConfigUtils.TWITTER_API_KEY
TWITTER_API_KEY_SECRET = ConfigUtils.TWITTER_API_KEY_SECRET
TWITTER_BEARER_TOKEN = ConfigUtils.BEARER_TOKEN

REDDIT_CLIENT_ID = ConfigUtils.REDDIT_CLIENT_ID
REDDIT_CLIENT_SECRET = ConfigUtils.REDDIT_CLIENT_SECRET

NEWS_API_KEY = ConfigUtils.NEWSAPI_KEY

def scrapeData(ticker:str, days_back:int = 3) -> Path:

    file_path = create_csv_path("sentiment")

    with open(file_path ,mode = 'a', newline='', encoding='utf-8') as csvFile:
        writer = csv.writer(csvFile, delimiter=',')
        writer.writerow(["text","created_at","source","test"])
        with ThreadPoolExecutor(10) as executor:
            futures = [
                executor.submit(queryByTickerTwitter, ticker),
                executor.submit(queryByTickerReddit, ticker, days_back = 3),
                executor.submit(queryByTickerGoogle, ticker, days_back = 3)
            ]            
            for future in as_completed(futures):
                if( future.result() != None):
                    writer.writerows(future.result())
    return Path(file_path)
        

def queryByTickerTwitter(ticker:str, days_back = 3):
    ticker = ticker.upper()
    client = tweepy.Client(bearer_token = TWITTER_BEARER_TOKEN)
    query = ticker.upper().lstrip('$') + " lang:en -is:retweet"
    rows = []
    for tweet in tweepy.Paginator(client.search_recent_tweets, query=query,tweet_fields=['created_at'], max_results=100,start_time = None).flatten(limit=500):
        if( tweet.text.find(ticker) != -1):
            row = [tweet.text, str(tweet.created_at), "twitter"]
            rows.append(row)
    return rows


def queryByTickerReddit(ticker:str, limit = 1000, days_back = 3):
    # subreddits to query from: /r/stocks /r/wallstreetbets /r/investing /r/StockMarket
    now = datetime.now()
    reddit = praw.Reddit( client_id=REDDIT_CLIENT_ID, client_secret=REDDIT_CLIENT_SECRET, user_agent="cointossgang")
    rows = []
    for post in reddit.subreddit("stocks+wallstreetbets+investing+StockMarket").search(query = ticker, time_filter="week",limit = limit ,sort = "relevance"):
        created = datetime.fromtimestamp(post.created_utc)
        if (now - created).days <= days_back :  # Check to see if post is within 3 days
            rows.append([post.selftext, str(created),"reddit"])
    print(len(rows))
    return rows



                    
def queryByTickerGoogle(ticker:str, days_back:int = 3, limit = 100):
    rows = []
    links = set()
    search_url = "https://news.google.com/search?q={0}+{1}&hl=en".format(ticker, days_back)
    res = requests.get(url = search_url)
    soup = BeautifulSoup(res.content, 'html.parser')

    for a in soup.find_all('a', href=True, limit = limit):
        href = a['href']
        if( href.startswith("./articles") ):
            links.add("http://news.google.com" + href[1:])

    with ThreadPoolExecutor(max_workers=100) as executor:
        executor.map(scrape_news_article, links, repeat(rows))   

    return rows        

def scrape_news_article(url,rows):
    try:
        article = Article(url)
        article.download()
        article.parse()
        
        rows.append([article.text,article.publish_date, url])
    except Exception as e :
        print(str(e))
        return 




#Article dict keys : ['source', 'author', 'title', 'description', 'url', 'urlToImage', 'publishedAt', 'content']
def queryByTickerNewsAPI(ticker:str, days_back = 3):
    rows = []
    from_date = (datetime.today() - timedelta(days=3)).strftime("%Y-%m-%d")
    url = ('https://newsapi.org/v2/everything?'
       'q={ticker}&'
       'from={from_date}&' 
       'language=en&'  
       'sortBy=relevancy&'
       'apiKey={api_key}').format(ticker=ticker,  from_date=from_date , api_key = NEWS_API_KEY)
    
    res_json = requests.get(url).json()
    articles:list[dict] = res_json['articles']
    for article in articles:
        rows.append([article["content"], article["publishedAt"]])
    return rows
