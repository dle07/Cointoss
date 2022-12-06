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
      }).then(window.location.reload());
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
      <table style={{width: "45%"}}>
        <thead>
          <tr>
            <th scope='col'>Ticker Symbol</th>
            <th scope='col'>Price</th>
            <th scope='col'>Prediciton(Next Day)</th>
            <th scope='col'></th>
          </tr>
        </thead>
        <tbody>
          {tickerList.map((eachTicker, i) => {
            return (
              <tr key={i}>
                <td onClick={() => {navigate(`/StockPrice/${eachTicker}`)}}>{eachTicker}</td>
                {(tickerList.length === 1) ? <td>{tickerPrice[tickerPrice.length - 1]?.Close.toFixed(2)}</td> : 
                <td>{tickerPrice[`('Close', '${eachTicker}')`]?.toFixed(2)}</td>}
                {(loading) ? <td>Loading...</td> : 
                <td>{nextDayPred[i]?.toFixed(2)}</td>}
                <td onClick={() => {deleteTicker(eachTicker)}} style={{color: 'red'}}><CloseIcon/></td>
              </tr>
            );
          })}
        </tbody>
      </table>
        {console.log(tickerList)}
      </div>
    </>
  )
}
