import React from 'react'
import { useLocation } from "react-router-dom"

export default function HistoricalData() {
    const location = useLocation();
    const getPath = location.pathname; // get whole path name
    const splitTicker = getPath.split('/');
    const ticker = splitTicker[splitTicker.length - 1]; // holds the ticker
  return (
    <div>
      <h1>{ticker}</h1>
    </div>
  )
}
