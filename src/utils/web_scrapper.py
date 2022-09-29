from pprint import pprint
import tweepy
from src.utils.ConfigUtils import ConfigUtils
import re
import csv
import requests
from src.utils.storage_utils import create_csv_path

"""
Querying
https://github.com/twitterdev/getting-started-with-the-twitter-api-v2-for-academic-research/blob/main/modules/5-how-to-write-search-queries.md
"""


API_KEY = ConfigUtils.API_KEY
API_KEY_SECRET = ConfigUtils.API_KEY_SECRET
BEARER_TOKEN = ConfigUtils.BEARER_TOKEN



class Tweepy():

    pass

def queryByTickerTwitter(ticker:str):
    client = tweepy.Client(bearer_token = BEARER_TOKEN)
    query = ticker.upper().lstrip('$') + " lang:en -is:retweet"
    filtered = []
    cols = ["text,created_at"]
    file_name = create_csv_path("twitter")

    with open(file_name,mode = 'a', newline='', encoding='utf-8') as csvFile:
        writer = csv.writer(csvFile, delimiter=',')
        writer.writerow(cols)
        for tweet in tweepy.Paginator(client.search_recent_tweets, query=query,
                                tweet_fields=['created_at'], max_results=100).flatten(limit=1000):

            if( re.search('\$VOO', tweet.text) != None):
                row = [tweet.text]
                filtered.append(tweet)
                if(tweet.created_at != None):
                    row.append(tweet.created_at)
                writer.writerow(row)

def queryByTickerReddit(ticker:str):
    pass


def testRedditAPI():

    pass
                    
            




    
