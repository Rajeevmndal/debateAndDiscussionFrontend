
import * as process from 'process';

window.global = window;

window.process = process;

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

import App from './App.jsx';
import { AppContextProvider } from './components/context/AppContext';
import './index.css';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
     
      <AppContextProvider>
        <App />
      </AppContextProvider>
      
    </BrowserRouter>
  </StrictMode>
);