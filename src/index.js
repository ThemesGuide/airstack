import React from 'react';
import { render } from 'react-dom';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router-dom';
import bootstrap from 'bootstrap'; // eslint-disable-line no-unused-vars
import App from './App';
import './css/index.css';

const hist = createBrowserHistory();

render((
  <Router history={hist}>
    <App />
  </Router>
), document.getElementById('root'));
