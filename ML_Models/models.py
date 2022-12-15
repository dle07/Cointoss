import numpy as np
import pandas as pd
import yfinance as yf
import pandas_market_calendars as mcal
import requests
import json
from fastapi import APIRouter, Response
from tensorflow.keras.models import load_model
from sklearn.preprocessing import MinMaxScaler
from datetime import date, datetime, timedelta
from keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from cachetools import cached, LRUCache, TTLCache
from backend.src.utils import web_scrapper

router = APIRouter()
#Load models
time_series_model = load_model("ML_Models/SP500_Model.h5")
sentiment_model = load_model("ML_Models/SAM.h5")

#Prepare Tokenizer for sentiment model
df = pd.read_csv("ML_Models/stock_sentiment_data.csv")
tweet_df = df[['Tweet_Text','Sentiment']]
tweet_df = tweet_df[tweet_df['Sentiment'] != 'Neutral']
sentiment_label = tweet_df.Sentiment.factorize()

tweet = tweet_df.Tweet_Text.values
tokenizer = Tokenizer(num_words=5000)
tokenizer.fit_on_texts(tweet)
""""
vocab_size = len(tokenizer.word_index) + 1
encoded_docs = tokenizer.texts_to_sequences(tweet)
padded_sequence = pad_sequences(encoded_docs, maxlen=200)
"""
@cached(cache=TTLCache(maxsize=21, ttl=timedelta(hours = 1) , timer=datetime.now) )   # ttl is in seconds
def compute(tickerSymbol):
    #set sequence length to thee lengththe model was trained with
    sequence_length = 50
    df = yf.download(tickerSymbol,period="5y")
    FEATURES = ['High', 'Low', 'Open', 'Close', 'Volume', 'Adj Close']
    df_filtered = df.filter(FEATURES)
    np_data_unscaled = np.array(df_filtered)

    #Scaler for x values
    scaler = MinMaxScaler()
    scaler.fit(np_data_unscaled)

    #scaler for prediction
    scaler_pred = MinMaxScaler()
    df_close = pd.DataFrame(df_filtered['Close'])
    scaler_pred.fit(df_close)

    df_temp = df_filtered[-sequence_length:].values
    df_temp_scaled = scaler.transform(df_temp)

    x_pred = []
    x_pred.append(df_temp_scaled)

    pred_price_scaled = time_series_model.predict(np.array(x_pred))
    pred_price_unscaled = scaler_pred.inverse_transform(pred_price_scaled.reshape(-1, 1))

    nyse_cal = mcal.get_calendar('NYSE')

    current_date = datetime.today()
    end_date = current_date + timedelta(days = 14)
    
    nyse_next_days = nyse_cal.valid_days(start_date=current_date, end_date=end_date)

    pred_price_dict =[
        {"date": nyse_next_days[0].date(), "prediction": pred_price_unscaled.ravel()[0].item()},
        {"date": nyse_next_days[1].date(), "prediction": pred_price_unscaled.ravel()[1].item()},
        {"date": nyse_next_days[2].date(), "prediction": pred_price_unscaled.ravel()[2].item()},
        {"date": nyse_next_days[3].date(), "prediction": pred_price_unscaled.ravel()[3].item()},
        {"date": nyse_next_days[4].date(), "prediction": pred_price_unscaled.ravel()[4].item()}
    ]

    return {"ticker":tickerSymbol,"pred_price_dict": pred_price_dict}

@router.get("/ml/time-series")
async def time_series(tickerSymbol):
    return compute(tickerSymbol)


@router.get("/ml/sentiment")
async def sentiment(tickerSymbol, days_back=3):

    url = "http://localhost:5000/scrape_data?ticker="+tickerSymbol

    scrapped_data_json = requests.get(url).json()
    scrapped_data_df = pd.DataFrame(scrapped_data_json)
    scrapped_data_df.columns = ["text","created_at","source","title"]

    scraped_data_fix = scrapped_data_df.dropna(subset=["text"]).reset_index(drop = True)

    scraped_data_text = scraped_data_fix["text"]

    tw = tokenizer.texts_to_sequences(scraped_data_text)
    tw = pad_sequences(tw,maxlen=200)
    predictions = sentiment_model.predict(tw)#.round()

    headlines_sentiment = pd.concat([scraped_data_fix, pd.DataFrame(predictions, columns=['sentiment'])], axis = 1)

    #This section turns float values from prediction to Positive/Negative. 
    """"
    def parse_predictions(prediction):
        sentiment = sentiment_label[1][prediction]
        return sentiment

    headlines_sentiment['sentiment'] = headlines_sentiment['sentiment'].apply(parse_predictions)
    """

    return headlines_sentiment.to_dict(orient='records')


@router.get("/ml/sentiment-news")
async def sentimentNews(tickerSymbol, days_back=3):

    url = "http://localhost:5000/scrape_data_headlines?ticker="+tickerSymbol

    scrapped_data_json = requests.get(url).json()
    scrapped_data_df = pd.DataFrame(scrapped_data_json)
    scrapped_data_df.columns = ["text","created_at","source","title"]

    scraped_data_fix = scrapped_data_df.dropna(subset=["text"]).reset_index(drop = True)

    scraped_data_text = scraped_data_fix["text"]

    tw = tokenizer.texts_to_sequences(scraped_data_text)
    tw = pad_sequences(tw,maxlen=200)
    predictions = sentiment_model.predict(tw).round()

    headlines_sentiment = pd.concat([scraped_data_fix, pd.DataFrame(predictions, columns=['sentiment'])], axis = 1)

    def parse_predictions(prediction):
        sentiment = sentiment_label[1][prediction]
        return sentiment

    headlines_sentiment['sentiment'] = headlines_sentiment['sentiment'].apply(parse_predictions)

    return headlines_sentiment.to_dict(orient='records')
