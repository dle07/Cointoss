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

export function MoreInfo(ticker) {
    const [info, setInfo] = useState([]);
    const dates = [];
    const open_price = [];
    const high_price = [];
    const low_price = [];
    const close_price = [];
    const volume = [];

   const fetchData = async () => {
       axios.get(`/stock-data?tickerSymbol=${ticker.name}`).then(res => setInfo(res.data))
    };
    useEffect(()=> {
        fetchData();
    }, []);

    //pushes the last 100 days worth on data into array
    for(let i = info.length - 1; i >= info.length - 100; i--) {
        dates.push(info[i]?.Date);
        open_price.push(info[i]?.Open);
        high_price.push(info[i]?.High);
        low_price.push(info[i]?.Low);
        close_price.push(info[i]?.Close);
        volume.push(info[i]?.Volume);
    }
    // converts epoch time to date(YY-MM-DD)
    for(let i = 0; i < dates.length; i++) {
        let newDate = new Date(dates[i]);
        let year = newDate.getFullYear();
        let month = newDate.getMonth() + 1;
        let day = newDate.getDate();
        dates[i] = year + '-' + month + '-' + day;
    }

    return (
        <table>
            <thead>
                <tr>
                    <th scope='col'>Date</th>
                    <th scope='col'>Open</th>
                    <th scope='col'>High</th>
                    <th scope='col'>Low</th>
                    <th scope='col'>Close</th>
                    <th scope='col'>Volume</th>
                </tr>
            </thead>
            <tbody>
                {dates.map((index, i) => {
                    return(
                        <tr key={i}>
                            <td>{dates[i]}</td>
                            <td>{open_price[i]}</td>
                            <td>{high_price[i]}</td>
                            <td>{low_price[i]}</td>
                            <td>{close_price[i]}</td>
                            <td>{volume[i]}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}

export function Tracker(ticker) {
    const [data, setData] = useState([]);
    const [modelPredictions, setModelPredictions] = useState([]);
    const x_coord = [];
    const y_coord = [];
    const x_pred = [];
    const y_pred = [];

   const fetchData = async () => {
       axios.get(`/stock-data?tickerSymbol=${ticker.name}`).then(res => setData(res.data));
       axios.get(`/ml/time-series?tickerSymbol=${ticker.name}`).then(res => setModelPredictions(res.data));
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

    //push prediction data into array
    for (let i = 0; i < modelPredictions.length; ++i) {
        x_pred.push(modelPredictions[i].date);
        y_pred.push(modelPredictions[i].prediction);
    }

    console.log(y_pred);

    return (
        <>
            <Plot data={[
                {
                    x: x_coord,
                    y: y_coord,
                    type: 'scatter',
                    mode: 'lines+markers', 
                    marker: { color: 'red' },
                    name: "Price History"
                },
                {
                    x: x_pred,
                    y: y_pred,
                    type: 'scatter',
                    mode: 'lines+markers',
                    marker: { color: 'blue' },
                    name: "Prediction"
                }
            ]}
                layout={ {width: "50%", height: "auto", title: ticker.name + ' ' + data[data.length - 1]?.Close.toFixed(2)} }
            />
        </>
    )
}

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