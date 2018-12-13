import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerSW from './registerSW';
import './index.css';

ReactDOM.render(<App />, document.getElementById('root'));
registerSW();
