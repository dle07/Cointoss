import React, {useState} from 'react'
import './SearchBar.css'
import Symbols from './symbols.json'
import axios from 'axios';
import { useNavigate } from "react-router-dom"
import SearchIcon from '@mui/icons-material/Search';

export function SearchBar() {
    const [newSymbol, setNewSymbol] = useState([]);
    const [backupSymbol, setBackupSymbol] = useState([]);
    const [tickerFound, setTickerFound] = useState(true);
    const navigate = useNavigate();

    const checkSymbol = async () => {
        if(backupSymbol.length > 0) {
            axios.get(`/stock-data?tickerSymbol=${backupSymbol}`).then(res => {
                if(res.data.length > 0) {
                    setTickerFound(true);
                    navigate(`/StockPrice/${backupSymbol.toUpperCase()}`);
                    window.location.reload();
                } else {
                    setTickerFound(false);
                }
            });
        }
     };

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
                        setBackupSymbol([]);
                    } else {
                        setNewSymbol(filterData);
                        setBackupSymbol(targetSymbol);
                    }
                }}></input>
                <div className='search-icon' onClick={() => checkSymbol()}><SearchIcon /></div>
            </div>
            
            {newSymbol.length !== 0 && (
                <div className="results">
                    {newSymbol.slice(0, 10).map((data, i) => {
                        let correct_Format = data.symbol;
                        if(data.symbol.includes('.')) {
                            correct_Format = correct_Format.replace('.', '-');
                        }
                        return (
                            <div className="eachResults" key={i} onClick={() => {
                                navigate(`/StockPrice/${correct_Format}`)
                                window.location.reload();
                            }}>
                                <p>{correct_Format}</p>
                            </div>
                        );
                    })}        
                </div>
            )}
            {tickerFound === false && <p style={{color: "red", position: "absolute"}}>{backupSymbol} is not found</p>}
        </div>
    );
}
