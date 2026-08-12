// * ////////////////////////////////////////////////////////////////////////
// *
// * FileName     [ index.js ]
// * PackageName  [ src ]
// * Synopsis     [ Export App ]
// * Author       [ Cheng-Hua Lu ]
// * Copyright    [ 2022 8 ]
// * 
// * ////////////////////////////////////////////////////////////////////////

import './index.scss';
import App from './App';
import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from 'react-router-dom';

// GitHub Pages SPA fallback: when a deep link misses a static file, 404.html
// stores the requested path here and redirects to "/". Restore it before the
// router mounts so direct deep links (e.g. /members/xxx, /zh/about) still work.
const spaPath = sessionStorage.getItem('dvlab-spa-path');
if (spaPath) {
  sessionStorage.removeItem('dvlab-spa-path');
  window.history.replaceState(null, '', spaPath);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
