import React from 'react'
import { useLocation } from "react-router-dom"
import { MoreInfo } from '../components/Tracker';
import { useNavigate } from "react-router-dom"

export default function HistoricalData() {
    const location = useLocation();
    const getPath = location.pathname; // get whole path name
    const splitTicker = getPath.split('/');
    const ticker = splitTicker[splitTicker.length - 1]; // holds the ticker
    const navigate = useNavigate();

  return (
    <>
      <div className="header">
        <h1 onClick={() => navigate(`/StockPrice/${ticker}`)} className="back">Go Back</h1>
        <h1 className='about'>Historical Data</h1>
      </div>
      <div>
        <h1><MoreInfo name={ticker} /></h1>
      </div>
    </>
  )
}
