// * /////////////////////////////////////////////////////////////////////////////////////////////
// *
// * FileName     [ App.js ]
// * PackageName  [ src ]
// * Synopsis     [ Implementation of NavBar, Router of each page and Footer ]
// * Author       [ Cheng-Hua Lu ]
// * Copyright    [ 2022 8 ]
// * 
// * /////////////////////////////////////////////////////////////////////////////////////////////

import './App.scss';
import React from 'react';
import Home from './components/Home';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import AboutLab from './components/About';
import Members from './components/Members';
import Courses from './components/Courses';
import MemBio from './components/Members/MemBio';
import HostProfile from './components/HostProfile';
import Publications from './components/Publications';
import { Route, Routes } from 'react-router-dom';

const App = () => {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutLab />} />
        <Route path="/host" element={<HostProfile />} />
        <Route path="/publications" element={<Publications />} />
        <Route path="/members" element={<Members />} />
        <Route path="/members/:memberId" element={<MemBio />} />
        <Route path="/courses" element={<Courses />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
