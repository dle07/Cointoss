import React, { useState } from 'react';
import { useLocation } from "react-router-dom"
import { Tracker } from '../components/Tracker';
import { SearchBar } from '../components/SearchBar';
import { useNavigate } from "react-router-dom";
import {useCookies} from 'react-cookie';
import { Sentiment } from '../components/Sentiment';

function StockPrice() {
    const location = useLocation();
    const getPath = location.pathname; // get whole path name
    const splitTicker = getPath.split('/');
    //const ticker = splitTicker[splitTicker.length - 1]; // holds the ticker
    const navigate = useNavigate();
    const [cookies] = useCookies(['jwt']);
    const [ticker] = useState(splitTicker[splitTicker.length - 1]);
    const [showSentimentLabel, setShowSentimentLabel] = useState(false);
    
    const addTicker = async() => {
        const token = `Bearer ${cookies.jwt.auth_token}`;
        console.log(token);
        let ticker_ = {ticker};
        try {
            await fetch("/portfolio/add", {
                method: "POST",
                body: JSON.stringify(ticker_),
                headers: {
                    "jwt-token": token,
                    "Content-type": "application/json",
                },
            }).then(navigate(`/portfolio`));
        } catch (err) {
            console.log(err);
        }
    };

    const showSentiment = () => {
        if(showSentimentLabel === false) {
            setShowSentimentLabel(true);
        } else {
            setShowSentimentLabel(false);
        }
    }
    
    return (
        <>
            <div className="header">
                <a href='/' className="logo">Cointoss</a>
                <div className='nav-header'>
                    <a href='/about_us' className='link'>About Us</a>
                    <a href='/portfolio' className='link'>Your Portfolio</a>
                    <div className='adj-search'>
                        <SearchBar />
                    </div>
                </div>
            </div>
            <div className='search-track'>
                <Tracker name={ticker} />
            </div>
            <div className='hist_add'>
                <button onClick={() => navigate(`/HistoricalData/${ticker}`)} className='button_price'>Historical Data</button>
                <button onClick={() => showSentiment()} className='button_price'>Sentiment Label</button>
                <button onClick={() => addTicker()} className='button_price'>Add to Portfolio</button>
            </div>
            {(showSentimentLabel) && <div className='sentiment'><Sentiment name={ticker} /></div>}
        </>
    )
}
export default StockPrice
