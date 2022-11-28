import React, { useState, useEffect } from 'react'
import axios from 'axios';
import HeatMap from 'react-heatmap-grid'
import { useNavigate } from "react-router-dom"

const xLabels = new Array(7).fill(0).map((_, i) => `${''}`);
const tick = ['AAPL', 'MSFT', 'IBM', 'GOOG', 'AMZN', 'TSLA', 'BRK-B', 'UNH', 'XOM', 'JNJ', 'V', 'JPM', 'WMT', 'NVDA', 'CVX', 'LLY', 'TSM', 'PG', 'MA', 'BAC', 'HD'];

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

function Heatmap() {
    const [rawData, setRawData] = useState([]);

    //grabs data from backend
    const fetchData = async () => {
        axios.get(`/stock-data?tickerSymbol=${tick}&timePeriod=1d`).then(res => setRawData(res.data[0]))
    };
    useEffect(() => {
        fetchData();
    }, []);

    let tickCounter = 0;

    //replaces data array with actual data
    for (let j = 0; j < data.length; ++j) {
        for (let k = 0; k < data[j].length; ++k) {
            //Only works if there is more than one ticker symbol in the tick array as it is dependent on the format of the data being returned
            data[j][k] = tick[tickCounter] + '\n' + rawData[`('Close', '${tick[tickCounter]}')`]?.toFixed(2);
            ++tickCounter;
        }
    }

    //stores tickers in 2d array format
    let tickCount = 0;
    for (let j = 0; j < data.length; ++j) {
      for (let k = 0; k < data[j].length; ++k) {
          dataPosition[j][k] = tick[tickCount];
          ++tickCount;
      }
    }
    const navigate = useNavigate();

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
                        background: `rgba(00, 255, 00, ${Math.floor(Math.random() * 100) / 100})`,
                        fontSize: "15px",
                        fontWeight: "bold"
                    })}
                    cellRender={(value) => value}
                    title={(value, unit) => `${value}`}
                    height={170}
                />
            </div>
        </>
    )
}

export default Heatmap;