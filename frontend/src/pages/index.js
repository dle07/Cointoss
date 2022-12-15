import React from 'react';
import {SearchBar} from '../components/SearchBar';
import Heatmap from '../components/Heatmap';
import './styling.css';
import {useCookies} from 'react-cookie';
import LogOut from '../components/LogOut';
import AboutUs from './about_us';

function Landing() {
    const [cookies] = useCookies(['jwt']);
    console.log("landing", cookies.jwt);
    return (
        <>
            <div className="header">
                <a href='/' className="logo">Cointoss</a>
                <div className='nav-header'>
                    <a href='#info' className='link'>How&nbsp;does&nbsp;it&nbsp;work?</a>
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
            <div id='info' className='info'>
                <AboutUs />
            </div>
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