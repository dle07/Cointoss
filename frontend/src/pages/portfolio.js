import React, { useState, useEffect } from 'react';
import {SearchBar} from '../components/SearchBar';
import {useCookies} from 'react-cookie';
import axios from 'axios';

export default function Portfolio() {
  const [cookies] = useCookies(['jwt']);
  const [tickerList, setTickerList] = useState([]);
  const [tickerPrice, setTickerPrice] = useState([]);
  
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
        axios.get(`/stock-data?tickerSymbol=${ticker.tracked_tickers}&timePeriod=1d`).then(res => setTickerPrice(res.data[0])) 
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
      <table>
        <thead>
          <tr>
            <th scope='col'>Ticker Symbol</th>
            <th scope='col'>Price</th>
            <th scope='col'>Delete</th>
          </tr>
        </thead>
        <tbody>
          {tickerList.map((eachTicker, i) => {
            return (
              <tr>
                <td>{eachTicker}</td>
                <td>{tickerPrice[`('Close', '${eachTicker}')`]?.toFixed(2)}</td>
                <td onClick={() => {deleteTicker(eachTicker)}} style={{borderStyle: "solid"}}>X</td>
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
