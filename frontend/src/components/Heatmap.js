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
    const [loading, setLoading] = useState(true);
    //const [rawData, setRawData] = useState([]);
    const [trendingTickers, setTrendingTickers] = useState([]);
    //const [modelPredictions, setModelPredictions] = useState([]);
    const promises = [];
    const [priceDiffArray, setPriceDiffArray] = useState([]);
    //const [priceDiff, setPriceDiff] = useState([]);
    const arr = [];
    //grabs data from backend (top 21 tickers by volume and their prices)
    const fetchData = async () => {
        axios.get(`/highest-volume?limit=21`).then(res => {
            setTrendingTickers(res.data.tickers);
            axios.get(`/stock-data?tickerSymbol=${res.data.tickers}&timePeriod=1d`).then(price => {
                //setRawData(price.data[0])
                for(let i = 0; i < res.data.tickers.length; i++) {
                    promises.push(axios.get(`/ml/time-series?tickerSymbol=${res.data.tickers[i]}`));
                }
                //axios.get(`/ml/time-series?tickerSymbol=AAPL`).then(res => setModelPredictions(res.data));
                Promise.all(promises).then(responses => {
                    //console.log(typeof(responses[0].data[4].prediction))
                    //console.log(typeof(price.data[0][`('Close', '${res.data.tickers[0]}')`]))
                    //console.log(responses[0].data[4].prediction - price.data[0][`('Close', '${res.data.tickers[0]}')`])
                    let tickCounter = 0;
                    for (let j = 0; j < data.length; ++j) {
                        for (let k = 0; k < data[j].length; ++k) {
                            let difference_in_price = responses[tickCounter].data[4].prediction - price.data[0][`('Close', '${res.data.tickers[tickCounter]}')`];
                            //setPriceDiff(difference_in_price);
                            setPriceDiffArray(priceDiff => [...priceDiff, difference_in_price]);
                            data[j][k] = res.data.tickers[tickCounter] + '\n' + price.data[0][`('Close', '${res.data.tickers[tickCounter]}')`]?.toFixed(2) + '\n/ ' 
                            + responses[tickCounter].data[4].prediction?.toFixed(2);
                            //trendTickersVolume[j][k] = rawData[`('Volume', '${trendingTickers[tickCounter]}')`];
                            ++tickCounter;
                        }
                    }
                    setLoading(false);
                });
            });
        });
    };
    useEffect(() => {
        fetchData();
    }, []);

    //console.log(modelPredictions);
    
    
    //console.log(trendTickersVolume);
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
    if (loading) {
        return <div className='center'><h1>Loading...</h1></div>;
    }

    let count = 0;
    console.log(priceDiffArray);
    for(let i = 0; i < priceDiffArray.length; i++) {
        if(priceDiffArray[i] < 0) {
            arr.push(0);
        } else {
            arr.push(1);
        }
    }
    console.log(arr);

    return (
        <>
            <div style={{margin: "0px", display: "flex", justifyContent: "center", alignItems: "center"}}>
                <div style={{background: "red", paddingRight: "40px"}}>
                    <div style={{marginLeft: "-39px"}}>
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
                                background: `rgba(00, 255, 00, ${arr[count++]/1})`,
                                fontSize: "20px",
                                fontWeight: "bold"
                            })}
                            cellRender={(value) => value}
                            title={(value, unit) => `${value}`}
                            height={180}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Heatmap;