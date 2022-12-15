import React, { useState, useEffect } from 'react';
import {SearchBar} from '../components/SearchBar';
import {useCookies} from 'react-cookie';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';

export default function Portfolio() {
  const [cookies] = useCookies(['jwt']);
  const [tickerList, setTickerList] = useState([]);
  const [tickerPrice, setTickerPrice] = useState([]);
  const [nextDayPred, setNextDayPred] = useState([]);
  const [loading, setLoading] = useState(true);
  const promises = [];
  const navigate = useNavigate();
  
  const deleteTicker = async(ticker) => {
    const token = `Bearer ${cookies.jwt.auth_token}`;
    let ticker_ = {ticker};
    console.log(ticker_);
    
    try {
        await fetch("/portfolio/delete", {
            method: "DELETE",
            body: JSON.stringify(ticker_),
            headers: {
                "jwt-token": token,
                "Content-type": "application/json",
            },
        }).then(retrieveTickers());//window.location.reload());
    } catch (err) {
      console.log(err);
    }
  };

  const retrieveTickers = async() => {
    const token = `Bearer ${cookies.jwt.auth_token}`;
    
    try {
      await fetch("/portfolio/retrieve", {
        method: "GET",
        headers: {
          "jwt-token": token,
          "Content-type": "application/json",
        },
      }).then(res => res.json()).then((ticker) => {
        setTickerList(ticker.tracked_tickers);
        if(ticker.tracked_tickers.length > 1) {
          axios.get(`/stock-data?tickerSymbol=${ticker.tracked_tickers}&timePeriod=1d`).then(res => setTickerPrice(res.data[0])) 
        } else if (ticker.tracked_tickers.length === 1) {
          axios.get(`/stock-data?tickerSymbol=${ticker.tracked_tickers}`).then(res => setTickerPrice(res.data));
        }
        for(let i = 0; i < ticker.tracked_tickers.length; i++) {
          promises.push(axios.get(`/ml/time-series?tickerSymbol=${ticker.tracked_tickers[i]}`));
        }

        Promise.all(promises).then(responses => {
          for(let j = 0; j < ticker.tracked_tickers.length; j++) {
            let nextDayprediction = responses[j].data[0].prediction;
            setNextDayPred(prediction => [...prediction, nextDayprediction]);
            setLoading(false);
          }
        });  
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(()=> {
    retrieveTickers();
  }, []);

  return (
    <>
      <div className="header">
        <a href='/' className="logo">Cointoss</a>
        <h1 className='about'>Your Portfolio</h1>
        <div className='portfolio-searchbar'>
          <SearchBar />
        </div>
      </div>
      <div>
          {tickerList.map((eachTicker, i) => {
            return (
              <div key={i} className="portfolio_content">
                <h3 onClick={() => {navigate(`/StockPrice/${eachTicker}`)}}>{eachTicker}</h3>
                {(tickerList.length === 1) ? <p>Current Price: {tickerPrice[tickerPrice.length - 1]?.Close.toFixed(2)}</p> : 
                <p>Current Price: {tickerPrice[`('Close', '${eachTicker}')`]?.toFixed(2)}</p>}
                {(loading) ? <p>Loading...</p> : 
                <p>Next Days Prediction: {nextDayPred[i]?.toFixed(2)}</p>}
                <h2 onClick={() => {deleteTicker(eachTicker)}} style={{color: 'red'}}><CloseIcon/></h2>
              </div>
            );
          })}
      </div>
    </>
  )
}
