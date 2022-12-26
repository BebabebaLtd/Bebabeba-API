import React from 'react';
import './App.css';
import Home from './Components/Pages/HomePage/Home';
import About from './Components/Pages/about';
import Help from './Components/Pages/Help/Help.js'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Footer from './Components/Pages/Footer/footer';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' exact element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/help' element={<Help />} />
       
      </Routes>
      
      <Footer />
    </Router>
  );
}

export default App;
