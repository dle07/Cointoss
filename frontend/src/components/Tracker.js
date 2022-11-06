import React from 'react'
import {useState, useEffect} from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';
import '../App.css';
/*
function HandleClick() {
    const stockSymbol = document.querySelectorAll('div .eachResults');
    const [chosenSymbol, setChosenSymbol] = useState("");
    stockSymbol.forEach(ticker => ticker.addEventListener("click", function() {
        setChosenSymbol(JSON.stringify(ticker.innerText));
    }));
    console.log("after: " + chosenSymbol)
    return chosenSymbol;
}*/

function Tracker(ticker) {
    const [data, setData] = useState([]);
    const x_coord = [];
    const y_coord = [];

    const stockSymbol = document.querySelectorAll('div .eachResults');
    const [chosenSymbol, setChosenSymbol] = useState("");
    stockSymbol.forEach(ticker => ticker.addEventListener("click", function() {
        setChosenSymbol(ticker.innerText);
    }));

   const fetchData = async () => {
        axios.get(`/stock-data?tickerSymbol=${ticker.name}`).then(res => setData(res.data))
    };
    useEffect(()=> {
        fetchData();
    }, []);

    //pushes the last 100 days worth on data into array
    for(let i = data.length - 1; i >= data.length - 100; i--) {
        x_coord.push(data[i]?.Date);
        y_coord.push(data[i]?.Close);
    }
    // converts epoch time to date(YY-MM-DD)
    for(let i = 0; i < x_coord.length; i++) {
        let newDate = new Date(x_coord[i]);
        let year = newDate.getFullYear();
        let month = newDate.getMonth() + 1;
        let day = newDate.getDate();
        x_coord[i] = year + '-' + month + '-' + day;
    }

    return (
        <>
            <p className="ticker_position">{data[data.length - 1]?.Close.toFixed(2)}</p>
            
        </>
    )
}

export default Tracker

/*
<Plot data={[
                {
                    x: x_coord,
                    y: y_coord,
                    type: 'scatter',
                    mode: 'lines+markers', 
                    marker: {color: 'red'},
                }]}
                layout={ {width: "45%", height: "auto", title: ticker.name + ' ' + data[data.length - 1]?.Close.toFixed(2)} }
            />
*/