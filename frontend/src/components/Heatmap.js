import React, { useState, useEffect } from 'react'
import axios from 'axios';
import HeatMap from 'react-heatmap-grid'
import { useNavigate } from "react-router-dom"

const xLabels = new Array(7).fill(0).map((_, i) => `${''}`);
const yLabels = ["", "", ""];

//create data array filled with 0
let data = new Array(yLabels.length)
    .fill(0)
    .map(() =>
        new Array(xLabels.length).fill(0));
        
let dataPosition = new Array(yLabels.length)
    .fill(0)
    .map(() =>
        new Array(xLabels.length).fill(0));

const trendTickersVolume = new Array(yLabels.length)
    .fill(0)
    .map(() =>
        new Array(xLabels.length).fill(0));

function Heatmap() {
    const [rawData, setRawData] = useState([]);
    const [trendingTickers, setTrendingTickers] = useState([]);
    //const tick = ['AAPL', 'MSFT', 'IBM', 'GOOG', 'AMZN', 'TSLA', 'BRK-B', 'UNH', 'XOM', 'JNJ', 'V', 'JPM', 'WMT', 'NVDA', 'CVX', 'LLY', 'TSM', 'PG', 'MA', 'BAC', 'HD'];

    //grabs data from backend (top 21 tickers by volume and their prices)
    const fetchData = async () => {
        axios.get(`/highest-volume?limit=21`).then(res => {
            setTrendingTickers(res.data.tickers);
            axios.get(`/stock-data?tickerSymbol=${res.data.tickers}&timePeriod=1d`).then(res => setRawData(res.data[0]));
        });
    };
    useEffect(() => {
        fetchData();
    }, []);

    let tickCounter = 0;

    //replaces data array with actual data
    for (let j = 0; j < data.length; ++j) {
        for (let k = 0; k < data[j].length; ++k) {
            //Only works if there is more than one ticker symbol in the tick array as it is dependent on the format of the data being returned
            data[j][k] = trendingTickers[tickCounter] + '\n' + rawData[`('Close', '${trendingTickers[tickCounter]}')`]?.toFixed(2);
            trendTickersVolume[j][k] = rawData[`('Volume', '${trendingTickers[tickCounter]}')`];
            ++tickCounter;
        }
    }
    console.log(trendTickersVolume);
    //console.log(Math.max(trendTickersVolume))

    //stores tickers in 2d array format
    let tickCount = 0;
    for (let j = 0; j < data.length; ++j) {
      for (let k = 0; k < data[j].length; ++k) {
          dataPosition[j][k] = trendingTickers[tickCount];
          ++tickCount;
      }
    }
    const navigate = useNavigate();
    let count = 1;

    return (
        <>
            <div style={{ marginRight: "100px", display: "flex", justifyContent: "center", alignItems: "center"}}>
                <HeatMap
                    xLabels={xLabels}
                    yLabels={yLabels}
                    xLabelsLocation={"bottom"}
                    xLabelsVisibility={false}
                    xLabelWidth={50}
                    data={data}
                    squares
                    onClick={(x, y) => navigate(`/StockPrice/${dataPosition[y][x]}`)}
                    cellStyle={(background, value, min, max, data, x, y, color, fontWeight) => ({ 
                        background: `rgba(00, 255, 00, ${1/(count+=0.13)})`,
                        fontSize: "20px",
                        fontWeight: "bold"
                    })}
                    cellRender={(value) => value}
                    title={(value, unit) => `${value}`}
                    height={180}
                />
            </div>
        </>
    )
}

export default Heatmap;