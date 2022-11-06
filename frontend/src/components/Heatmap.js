import React, { useState, useEffect } from 'react'
import axios from 'axios';
import HeatMap from 'react-heatmap-grid'
import Tracker from './Tracker'
import { useNavigate } from "react-router-dom"

const xLabels = new Array(2).fill(0).map((_, i) => `${''}`);
const tick = ['AAPL', 'MSFT', 'IBM', 'GOOG', 'AMZN', 'TSLA'];

const yLabels = ["", "", ""];

//create data array filled with 0
let data = new Array(yLabels.length)
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
            data[j][k] = tick[tickCounter] + '\n' +rawData[`('Close', '${tick[tickCounter]}')`];
            ++tickCounter;
        }
    }

    const navigate = useNavigate();

    const stockSymbol = document.querySelectorAll('div .ticker_position');
    const [chosenSymbol, setChosenSymbol] = useState("");
    stockSymbol.forEach(ticker => ticker.addEventListener("click", function () {
        setChosenSymbol(JSON.stringify(ticker.innerText));
    }));
    //console.log(chosenSymbol)
    return (
        <HeatMap
            xLabels={xLabels}
            yLabels={yLabels}
            xLabelsLocation={"bottom"}
            xLabelsVisibility={false}
            xLabelWidth={50}
            data={data}
            squares
            onClick={() => navigate(`/StockPrice/${tick[0]}`)}
            cellStyle={(background, value, min, max, data, x, y) => ({
                background: `rgba(00, 255, 00)`,
                fontSize: "11px"
            })}
            cellRender={(value) => value}
            title={(value, unit) => `${value}`}
            height={100}
        />
    )
}

export default Heatmap;
