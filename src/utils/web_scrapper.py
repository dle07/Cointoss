import csv
import re
import sys
import time
import urllib.request
from datetime import datetime, timedelta
from pathlib import Path
from pprint import pprint

import praw
import requests
import tweepy
from bs4 import BeautifulSoup
from src.utils.ConfigUtils import ConfigUtils
from src.utils.storage_utils import create_csv_path

TWITTER_API_KEY = ConfigUtils.TWITTER_API_KEY
TWITTER_API_KEY_SECRET = ConfigUtils.TWITTER_API_KEY_SECRET
TWITTER_BEARER_TOKEN = ConfigUtils.BEARER_TOKEN

REDDIT_CLIENT_ID = ConfigUtils.REDDIT_CLIENT_ID
REDDIT_CLIENT_SECRET = ConfigUtils.REDDIT_CLIENT_SECRET

NEWS_API_KEY = ConfigUtils.NEWSAPI_KEY

def scrapeData(ticker) -> Path:
    file_path = create_csv_path("sentiment")
    twitter_data = queryByTickerTwitter(ticker)
    reddit_data = queryByTickerReddit(ticker)
    news_data = queryByTickerNews(ticker)

    with open(file_path ,mode = 'a', newline='', encoding='utf-8') as csvFile:
        writer = csv.writer(csvFile, delimiter=',')
        writer.writerow(["text,created_at"])
        writer.writerows(twitter_data)
        writer.writerows(reddit_data)
    return Path(file_path)
        



def queryByTickerTwitter(ticker:str):
    client = tweepy.Client(bearer_token = TWITTER_BEARER_TOKEN)
    query = ticker.upper().lstrip('$') + " lang:en -is:retweet"
    rows = []
    for tweet in tweepy.Paginator(client.search_recent_tweets, query=query,tweet_fields=['created_at'], max_results=100).flatten(limit=1000):
        if( re.search('\$VOO', tweet.text) != None):
            row = [tweet.text, str(tweet.created_at)]
            rows.append(row)
    return rows





def queryByTickerReddit(ticker:str, limit = 1000):
    # subreddits to query from: /r/stocks /r/wallstreetbets /r/investing /r/StockMarket
    now = datetime.now()
    reddit = praw.Reddit( client_id=REDDIT_CLIENT_ID, client_secret=REDDIT_CLIENT_SECRET, user_agent="cointossgang")
    rows = []
    for post in reddit.subreddit("stocks+wallstreetbets+investing+StockMarket").search(query = ticker, time_filter="week",limit = limit ,sort = "relevance"):
        created = datetime.fromtimestamp(post.created_utc)
        if (now - created).days <=3 :  # Check to see if post is within 3 days
            rows.append([post.selftext, str(created)])
    return rows


#Article dict keys : ['source', 'author', 'title', 'description', 'url', 'urlToImage', 'publishedAt', 'content']
def queryByTickerNews(ticker:str, days_back = 3):
    
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
                    
            




    
