import React from 'react'
import {SearchBar} from '../components/SearchBar'
import Tracker from '../components/Tracker'
import Heatmap from '../components/Heatmap'
import './styling.css'

function Landing() {
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
            <Heatmap />
        </>
    );
}

export default Landing;

/* 
<h1>Trending Stocks</h1>
                <div className="stocks-border">
                    <Tracker name={ticker}/>
                </div>
*/