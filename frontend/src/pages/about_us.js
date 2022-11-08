import React from 'react'
import ExampleGraph from './Images/exampleGraph.jpg'
import SentimentAnalysisImg from './Images/sentiment_analysis.jpg'
import TimeSeriesImg from './Images/timeSeriesImg.jpg'

function about_us() {
  return (
    <>
        <div className='header'>
            <a href='/' className="logo">Cointoss</a>
            <h1 className='about'>About Us</h1>
        </div>
        <div>
            <h2 className='questions'>What is Cointoss?</h2>
            <p className='text'>Cointoss is a web application that track stocks and utilizes machine learning to predict whether the stock price will increase or 
                decrease. You can create your own portfolio and store stocks that interest you from our prediction. The graph will look similar to this...</p>
            <div className='center'>
            <img src={ExampleGraph} alt="example" width="550"/>
            </div>
            <h2 className='questions'>How do we make predictions?</h2>
            <div className='container'>
              <img src={SentimentAnalysisImg} alt="sentimentImg" width="400"/>
              <div>
                <h2 className='prediction'>Sentiment Analysis</h2>
                <p className='texts'>
                  Sentiment Analysis uses natural language processing to determine the tone behind the text.
                  <ul>
                    <li>Negative: Predicts stock price will decrease</li>
                    <li>Neutral: No change</li>
                    <li>Positive: Predicts stock price will increase</li>
                  </ul>
                </p>
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
