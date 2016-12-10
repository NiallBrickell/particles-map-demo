import React from 'react';
import ReactDOM from 'react-dom';
import Perf from 'react-addons-perf';
import App from './App';
import readData from './readData';
import './index.css';

window.Perf = Perf;

readData();

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
