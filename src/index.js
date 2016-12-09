import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import readData from './readData';
import './index.css';

readData();

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
