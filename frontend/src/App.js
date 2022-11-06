import './App.css';
import React from 'react'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import About from './pages/about_us'
import Landing from './pages'
import Portfolio from './pages/portfolio'
import Login from './pages/Login'
import SignUp from './pages/SignUp';
import StockPrice from './pages/StockPrice';

function App() {
  return (
    <Router>
    <Routes>
        <Route exact path='/' element={<Landing />} />
        <Route path='/about_us' element={<About/>} />
        <Route path='/portfolio' element={<Portfolio/>} />
        <Route path='/Login' element={<Login/>} />
        <Route path='/SignUp' element={<SignUp/>} />
        <Route path='/StockPrice/:ticker' exact element={<StockPrice />} />
    </Routes>
    </Router>
  );
}

export default App;
