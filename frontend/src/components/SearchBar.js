import React, {useState} from 'react'
import './SearchBar.css'
import Symbols from './symbols.json'
import { useNavigate } from "react-router-dom"

function HandleClick() {
    const navigate = useNavigate();
    const stockSymbol = document.querySelectorAll('div .eachResults');
    stockSymbol.forEach(ticker => ticker.addEventListener("click", function() {
        window.location.reload(); //refresh the page every time you search for a new ticker
        navigate(`/StockPrice/${ticker.innerText}`)
    }));
    return '';
}

export function SearchBar() {
    const [newSymbol, setNewSymbol] = useState([]);
    
    return (
        <div className="search">
            <div className="input">
                <input type="text" placeholder="Enter a company symbol" onChange={(e) => {
                    const targetSymbol = e.target.value;
                    const filterData = Symbols.filter((data) => {
                        return data.symbol.toLowerCase().includes(targetSymbol.toLowerCase());
                    });
                    if(targetSymbol === '') {
                        setNewSymbol([]);
                    } else {
                        setNewSymbol(filterData);
                    }
                }}></input>
            </div>
            
            {newSymbol.length !== 0 && (
                <div className="results">
                    {newSymbol.slice(0, 10).map((data) => {
                        return (
                            <div className="eachResults">
                                <p>{data.symbol}</p>
                            </div>
                        );
                    })}        
                </div>
            )}
            <HandleClick />
            
        </div>
    );
}
