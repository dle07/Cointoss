import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';
import './Sentiment.css'

export function Sentiment(ticker) {
    const [loading, setLoading] = useState(true);
    const [modelSentiment, setModelSentiment] = useState([]);

    const fetchData = async () => {
        axios.get(`/ml/sentiment?tickerSymbol=${ticker.name}`).then(res => { setModelSentiment(res.data); setLoading(false); });
    };
    useEffect(() => {
        fetchData();
    }, []);

    console.log(modelSentiment);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div class="row">
            <div class="column">
                <h3>News</h3>
                <p>{modelSentiment[0].text}</p>
                <p>{modelSentiment[1].text}</p>
            </div>
            <div class="column">
                <h3>Sentiment</h3>
                <p>{modelSentiment[0].sentiment}</p>
                <p>{modelSentiment[1].sentiment}</p>
            </div>
        </div>
    )
}