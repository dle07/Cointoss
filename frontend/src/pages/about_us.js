import React from 'react'
import ExampleGraph from './Images/exampleGraph.jpg'
import SentimentAnalysisImg from './Images/sentiment_analysis.jpg'
import TimeSeriesImg from './Images/timeSeriesImg.jpg'
import Heatmap_ex from './Images/heatmap_ex.jpg'

function about_us() {
  return (
    <>
        <div className='header'>
            <h1 className='about'>How does it all work?</h1>
        </div>
        <div>
            <h2 className='questions'>What is Cointoss?</h2>
            <p className='text'>Cointoss is a web application that track stocks and utilizes machine learning to predict whether the stock price will increase or 
              decrease. You can create your own portfolio after you signup/login, and store stocks that interest you from our prediction. You could also view the headlines of the ticker in the tracking page, and see the negative/positive news on that ticker. The graph will look similar to this...</p>
            <div className='center'>
              <img src={ExampleGraph} alt="example" width="550"/>
            </div>
            <h2 className='questions'>What does the heatmap display and what the color represent?</h2>
            <div className='center'>
              <img src={Heatmap_ex} alt="example" width="700"/>
            </div>
            <div className='text'>The heatmap displays 21 tickers based on the highest trades/volumes. The ticker with the highest volume starts at the top left and ends at the bottom right. Each cell will have this format of "ticker symbol current price / Pred: day 5's prediction". 
            The color of each cell represent whether that specific ticker will go up or down in price. For example, the <p style={{color: 'rgb(0,255,0)', display: "inline"}}>brighter green</p> (Ex: T, NVDA) means the ticker will go up in price the most based on our day 5's 
            prediction, and the <p style={{color: 'rgb(200,255,200)', display: "inline"}}>lighter green</p> (Ex: AMC) means it's a small increase. This Logic also applies to the red (the brighter the red, the larger the decrease in price (Ex: <p style={{color: 'rgb(255,0,0)', display: "inline"}}>DOCU</p>, <p style={{color: 'rgb(255,200,200)', display: "inline"}}>PLTR</p>)).</div>
            <h2 className='questions'>How do we make predictions?</h2>
            <div className='container'>
              <img src={SentimentAnalysisImg} alt="sentimentImg" width="400"/>
              <div>
                <h2 className='prediction'>Sentiment Analysis</h2>
                <p className='texts'>
                  Sentiment Analysis uses natural language processing to determine the tone behind the text.
                </p>
                <ul className='texts'>
                  <li>Negative: Predicts stock price will decrease</li>
                  <li>Neutral: No change</li>
                  <li>Positive: Predicts stock price will increase</li>
                </ul>
              </div>
            </div>
            <div className='container-mg'>
              <div>
                <h2 className='prediction'>Time Series Analysis</h2>
                <p className='texts'>Time Series Analysis uses data points collected over an interval of time. Looking for patterns, trends, and why these trends occur. </p>
              </div>
              <img src={TimeSeriesImg} alt="TimeSeriesImg" width="450"/>
            </div>
        </div>
        <footer>
        <h2 className='questions'>Disclosure</h2>
        <p className='text'>By no means this is a 100% accurate predictor. This is purely for educational purposes and shouldn't be used to determine your choice on buying the stocks.</p>
        </footer>
    </>
  )
}

export default about_us;
