import datetime
import numpy as np
import pandas as pd
import yfinance as yf
from fastapi import APIRouter, Response
from tensorflow.keras.models import load_model
from sklearn.preprocessing import MinMaxScaler
from datetime import date
from keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences

from backend.src.utils import web_scrapper

router = APIRouter()
#Load models
time_series_model = load_model("ML_Models/QQQ_Model.h5")
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

@router.get("/ml/time-series")
async def time_series_test(tickerSymbol):
    #set sequence length to thee lengththe model was trained with
    sequence_length = 50
    df = yf.download(tickerSymbol)
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

    predicted_price = np.round(pred_price_unscaled.ravel()[0], 2)
    return {"prediction": predicted_price.item()}


@router.get("/ml/sentiment")
async def sentiment_test(ticker, days_back=3):
    scrapped_data_path = web_scrapper.scrapeData(ticker, days_back) #need to figure out a way to only call this only once for a certain time period.
    scraped_data = pd.read_csv(scrapped_data_path)
    scraped_data_text = scraped_data.dropna(subset=["text"])["text"].reset_index(drop = True)

    print(scraped_data_text.shape)

    tw = tokenizer.texts_to_sequences(scraped_data_text)
    tw = pad_sequences(tw,maxlen=200)
    predictions = sentiment_model.predict(tw).round()

    headlines_sentiment = pd.concat([scraped_data_text, pd.DataFrame(predictions, columns=['sentiment'])], axis = 1)

    def parse_predictions(prediction):
        sentiment = sentiment_label[1][prediction]
        return sentiment

    headlines_sentiment['sentiment'] = headlines_sentiment['sentiment'].apply(parse_predictions)

    return headlines_sentiment.to_dict(orient='records')
