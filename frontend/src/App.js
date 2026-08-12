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
import { Route, Routes, useLocation } from 'react-router-dom';
import { LocaleProvider, stripLocalePrefix } from './i18n/LocaleContext';

const App = () => {
  const location = useLocation();
  const locale = location.pathname.startsWith('/zh') ? 'zh' : 'en';
  // Match routes against the locale-stripped path so the same route table
  // serves both `/...` (English) and `/zh/...` (Traditional Chinese).
  const strippedLocation = { ...location, pathname: stripLocalePrefix(location.pathname) };

  return (
    <LocaleProvider locale={locale}>
      <NavBar />
      <Routes location={strippedLocation}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutLab />} />
        <Route path="/host" element={<HostProfile />} />
        <Route path="/publications" element={<Publications />} />
        <Route path="/members" element={<Members />} />
        <Route path="/members/:memberId" element={<MemBio />} />
        <Route path="/courses" element={<Courses />} />
      </Routes>
      <Footer />
    </LocaleProvider>
  );
}

export default App;
