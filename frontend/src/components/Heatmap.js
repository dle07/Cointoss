import React, { useState, useEffect } from 'react'
import axios from 'axios';
import HeatMap from 'react-heatmap-grid'
import { useNavigate } from "react-router-dom"
import LoadingGif from "../pages/Images/loadingAnimation.gif"

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

function Heatmap() {
    const [loading, setLoading] = useState(true);
    const [trendingTickers, setTrendingTickers] = useState([]);
    const promises = [];
    const [priceDiffArray, setPriceDiffArray] = useState([]);
    const fetchData = async () => {
        axios.get(`/highest-volume?limit=21`).then(res => {
            setTrendingTickers(res.data.tickers);
            axios.get(`/stock-data?tickerSymbol=${res.data.tickers}&timePeriod=1d`).then(price => {
                //setRawData(price.data[0])
                for(let i = 0; i < res.data.tickers.length; i++) {
                    promises.push(axios.get(`/ml/time-series?tickerSymbol=${res.data.tickers[i]}`));
                }
                Promise.all(promises).then(responses => {
                    let tickCounter = 0;
                    for (let j = 0; j < data.length; ++j) {
                        for (let k = 0; k < data[j].length; ++k) {
                            let difference_in_price = responses[tickCounter].data[4].prediction - price.data[0][`('Close', '${res.data.tickers[tickCounter]}')`];
                            setPriceDiffArray(priceDiff => [...priceDiff, difference_in_price]);
                            data[j][k] = res.data.tickers[tickCounter] + '\n' + price.data[0][`('Close', '${res.data.tickers[tickCounter]}')`]?.toFixed(2) + '\n/ Pred: ' 
                            + responses[tickCounter].data[4].prediction?.toFixed(2);
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
        return <div className='center_gif'><img src={LoadingGif} alt="Loading..." width="300"/></div>;
    }

    let count = 0;

    const color_change = () => {
        let index = count - 1;
        if(priceDiffArray[index] < 0) {
            return (Math.min(...priceDiffArray) - (Math.min(...priceDiffArray) - (priceDiffArray[index]))) / Math.min(...priceDiffArray) + 0.1;
        } else {
            if(Math.max(...priceDiffArray) - priceDiffArray[index] === 0) {
                return 1;
            } else {
                return (Math.max(...priceDiffArray) - (Math.max(...priceDiffArray) - priceDiffArray[index])) / Math.max(...priceDiffArray) + 0.1;
            }
        }
    }

    return (
        <>
            <div style={{margin: "0px", display: "flex", justifyContent: "center", alignItems: "center"}}>
                <div style={{background: "lightgray", paddingRight: "40px"}}>
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
                                background: (priceDiffArray[count++] < 0) ? `rgba(255,0,0,${color_change()})` : 
                                `rgba(0,255,0,${color_change()})`,
                                fontSize: "20px",
                                fontWeight: "bold",
                                border: "2px solid black"
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