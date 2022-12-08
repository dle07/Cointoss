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

    var totalSentiemnt = 0;
    var positiveSentiment = 0;
    var negativeSentiment = 0;

    for (let i = 0; i < modelSentiment.length; ++i) {
        totalSentiemnt += modelSentiment[i].sentiment;
        if (modelSentiment[i].sentiment < 0.5) {
            ++negativeSentiment;
        } else {
            ++positiveSentiment;
        }
    }

    var sentimentAverage = totalSentiemnt / modelSentiment.length;

    var postiveBarWidth = { width: `${(positiveSentiment / (positiveSentiment + negativeSentiment)) * 100}%`};
    var negativeBarWidth = { width: `${(negativeSentiment / (positiveSentiment + negativeSentiment)) * 100}%` };

    const [newsContent, setNewsContent] = useState([]);
    const [sentimentContent, setSentimentContent] = useState([]);
    const [currItem, setCurrItem] = useState(5);

    const addNewsElement = () => {
        if (currItem + 5 > modelSentiment.length) {
            console.log('Out of items');
        } else {
            const newsElement1 = <p>{modelSentiment[currItem].text}</p>;
            const newSentiment1 = <p>{modelSentiment[currItem].sentiment}</p>;

            const newsElement2 = <p>{modelSentiment[currItem+1].text}</p>;
            const newSentiment2 = <p>{modelSentiment[currItem + 1].sentiment}</p>;

            const newsElement3 = <p>{modelSentiment[currItem+2].text}</p>;
            const newSentiment3 = <p>{modelSentiment[currItem + 2].sentiment}</p>;

            const newsElement4 = <p>{modelSentiment[currItem+3].text}</p>;
            const newSentiment4 = <p>{modelSentiment[currItem + 3].sentiment}</p>;

            const newsElement5 = <p>{modelSentiment[currItem+4].text}</p>;
            const newSentiment5 = <p>{modelSentiment[currItem + 4].sentiment}</p>;

            setNewsContent(() => [...newsContent, newsElement1, newsElement2, newsElement3, newsElement4, newsElement5]);
            setSentimentContent(() => [...sentimentContent, newSentiment1, newSentiment2, newSentiment3, newSentiment4, newSentiment5]);
            setCurrItem(currItem + 5);
        }
    };


    if (loading) {
        return <div class="loading">Loading...</div>;
    }

    return (
        <div>
            <div class="bar-container">
                <div class="positive" style={postiveBarWidth}>Positve</div>
                <div class="negative" style={negativeBarWidth}>Negative</div>
            </div>
           <div class="row">
                <div class="column">
                    <h3>News</h3>
                    <p>{modelSentiment[0].text}</p>
                    <p>{modelSentiment[1].text}</p>
                    <p>{modelSentiment[2].text}</p>
                    <p>{modelSentiment[3].text}</p>
                    <p>{modelSentiment[4].text}</p>
                    {newsContent}
                </div>
               <div class="column">
                    <h3>Sentiment</h3>
                    <p>{modelSentiment[0].sentiment}</p>
                    <p>{modelSentiment[1].sentiment}</p>
                    <p>{modelSentiment[2].sentiment}</p>
                    <p>{modelSentiment[3].sentiment}</p>
                    <p>{modelSentiment[4].sentiment}</p>
                    {sentimentContent}
                </div>
            </div>
            <button type="button" onClick={addNewsElement}>Load More</button>
        </div>
    )
}