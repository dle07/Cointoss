import React from 'react'
import { useLocation } from "react-router-dom"

function StockPrice() {
    const location = useLocation();
    const getPath = location.pathname; // get whole path name
    const splitTicker = getPath.split('/');
    const ticker = splitTicker[splitTicker.length - 1]; // holds the ticker
    console.log(ticker);
    
    return (
        <>
            <div className="header">
                <a href='/' className="logo">Cointoss</a>
            </div>
            <h1>{ticker}</h1>
        </>
    )
}
export default StockPrice
