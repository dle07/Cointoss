import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';
import './Sentiment.css'

export function Sentiment(ticker) {
    const [loading, setLoading] = useState(true);
    const [loading2, setLoading2] = useState(true);
    const [modelSentiment, setModelSentiment] = useState([]);
    const [modelSentimentNews, setModelSentimentNews] = useState([]);

    const fetchData = async () => {
        axios.get(`/ml/sentiment?tickerSymbol=\$${ticker.name}`).then(res => { setModelSentiment(res.data); setLoading(false); });
        axios.get(`/ml/sentiment-news?tickerSymbol=\$${ticker.name}`).then(res => { setModelSentimentNews(res.data); setLoading2(false); });
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
        if (currItem + 5 > modelSentimentNews.length) {
            console.log('Out of items');
        } else {
            const newsElement1 = <p><a href={modelSentimentNews[currItem].source}>{modelSentimentNews[currItem].title}</a></p>;
            const newSentiment1 = <p>{modelSentimentNews[currItem].sentiment}</p>;

            const newsElement2 = <p><a href={modelSentimentNews[currItem + 1].source}>{modelSentimentNews[currItem + 1].title}</a></p>;
            const newSentiment2 = <p>{modelSentimentNews[currItem +1].sentiment}</p>;

            const newsElement3 = <p><a href={modelSentimentNews[currItem + 2].source}>{modelSentimentNews[currItem + 2].title}</a></p>;
            const newSentiment3 = <p>{modelSentimentNews[currItem + 2].sentiment}</p>;

            const newsElement4 = <p><a href={modelSentimentNews[currItem+ 3].source}>{modelSentimentNews[currItem + 3].title}</a></p>;
            const newSentiment4 = <p>{modelSentimentNews[currItem + 3].sentiment}</p>;

            const newsElement5 = <p><a href={modelSentimentNews[currItem + 4].source}>{modelSentimentNews[currItem + 4].title}</a></p>;
            const newSentiment5 = <p>{modelSentimentNews[currItem + 4].sentiment}</p>;

           setNewsContent(() => [...newsContent, newsElement1, newsElement2, newsElement3, newsElement4, newsElement5]);
           setSentimentContent(() => [...sentimentContent, newSentiment1, newSentiment2, newSentiment3, newSentiment4, newSentiment5]);
           setCurrItem(currItem + 5);
        }
    };

    if (loading || loading2) {
        return <div class="loading">Loading...</div>;
    }

    return (
        <div>
            <div class="bar-container">
                <div class="positive" style={postiveBarWidth}>
                    <div class="tooltip"> Positive
                        <span class="tooltiptext">  {positiveSentiment} </span>
                     </div>
                </div>
                <div class="negative" style={negativeBarWidth}>
                    <div class="tooltip"> Negative
                        <span class="tooltiptext"> {negativeSentiment} </span>
                     </div>
                </div>
                
            </div>
            
           <div class="row">
                <div class="column">
                    <h3>News</h3>
                    <p><a href={modelSentimentNews[0].source}>{modelSentimentNews[0].title}</a></p>
                    <p><a href={modelSentimentNews[1].source}>{modelSentimentNews[1].title}</a></p>
                    <p><a href={modelSentimentNews[2].source}>{modelSentimentNews[2].title}</a></p>
                    <p><a href={modelSentimentNews[3].source}>{modelSentimentNews[3].title}</a></p>
                    <p><a href={modelSentimentNews[4].source}>{modelSentimentNews[4].title}</a></p>
                    {newsContent}
                </div>
                <div class="sentiment-column">
                    <h3>Sentiment</h3>
                    <p>{modelSentimentNews[0].sentiment}</p>
                    <p>{modelSentimentNews[1].sentiment}</p>
                    <p>{modelSentimentNews[2].sentiment}</p>
                    <p>{modelSentimentNews[3].sentiment}</p>
                    <p>{modelSentimentNews[4].sentiment}</p>
                    {sentimentContent}
                </div>
               
            </div>
            <button type="button" onClick={addNewsElement}>Load More</button>
        </div>
    )
}