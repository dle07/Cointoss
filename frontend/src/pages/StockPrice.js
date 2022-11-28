import React from 'react'
import { useLocation } from "react-router-dom"
import { Tracker } from '../components/Tracker'
import { SearchBar } from '../components/SearchBar';
import { useNavigate } from "react-router-dom"

function StockPrice() {
    const location = useLocation();
    const getPath = location.pathname; // get whole path name
    const splitTicker = getPath.split('/');
    const ticker = splitTicker[splitTicker.length - 1]; // holds the ticker
    const navigate = useNavigate();
    
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
                    <div className='move-right'>
                    <a href='/SignUp' className='link-sign'>Sign Up</a>
                    <a href='/Login' className='link-sign'>Login</a>
                    </div>
                </div>
            </div>
            <div className='search-track'>
                <Tracker name={ticker} />
                <button onClick={() => navigate(`/HistoricalData/${ticker}`)}>Historical Data</button>
            </div>
        </>
    )
}
export default StockPrice
