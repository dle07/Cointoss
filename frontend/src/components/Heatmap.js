import React, { useState } from 'react'
import HeatMap from 'react-heatmap-grid'
import Tracker from './Tracker'
import { useNavigate } from "react-router-dom"

const xLabels = new Array(2).fill(0).map((_, i) => `${''}`);
const tick = ['AAPL', 'MSFT', 'IBM', 'GOOG', 'AMZN', 'TSLA'];
let i = 0;
let j = 0;

const yLabels = ["", "", ""];
const data = new Array(yLabels.length)
  .fill(0)
  .map(() =>
    new Array(xLabels.length).fill(0).map(() => {
      console.log(tick[i]);
      if(j !== 0) {
        i++;
      }
      j++;
      return <Tracker name={tick[i]}/>
    })
  );

function Heatmap() {
  const navigate = useNavigate();

  const stockSymbol = document.querySelectorAll('div .ticker_position');
    const [chosenSymbol, setChosenSymbol] = useState("");
    stockSymbol.forEach(ticker => ticker.addEventListener("click", function() {
        setChosenSymbol(JSON.stringify(ticker.innerText));
    }));
  console.log(chosenSymbol)
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
