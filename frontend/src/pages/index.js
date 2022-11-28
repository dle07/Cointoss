import React from 'react'
import {SearchBar} from '../components/SearchBar'
import Heatmap from '../components/Heatmap'
import './styling.css'
import {useCookies} from 'react-cookie';
import LogOut from '../components/LogOut';

function Landing() {
    const [cookies] = useCookies(['jwt']);
    console.log("landing", cookies.jwt);
    return (
        <>
            <div className="header">
                <a href='/' className="logo">Cointoss</a>
                <div className='nav-header'>
                    <a href='/about_us' className='link'>About&nbsp;Us</a>
                    <a href='/portfolio' className='link'>Your&nbsp;Portfolio</a>
                    <div className='adj-search'>
                        <SearchBar />
                    </div>
                    <div className='move-right'>
                        {(cookies.jwt !== "" && cookies.jwt !== undefined) ? <LogOut /> : <>
                            <a href='/SignUp' className='link-sign'>Sign&nbsp;Up</a>
                            <a href='/Login' className='link-sign'>Login</a>
                        </>}
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